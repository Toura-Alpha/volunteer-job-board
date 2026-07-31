import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  MapPin,
  Calendar,
  ArrowLeft,
  Briefcase,
  HeartHandshake,
} from "lucide-react";
import { submitApplication } from "@/app/actions/apply";

async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch the specific listing
  const { data: listing, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !listing) {
    notFound();
  }

  // Fetch user profile for pre-filling the application form
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user?.id)
    .single();

  // Check if user has already applied
  const { data: existingApplication } = await supabase
    .from("applications")
    .select("id")
    .eq("listing_id", id)
    .eq("applicant_id", user?.id)
    .single();

  const isJob = listing.type === "job";

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userEmail={user?.email} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back button */}
        <div className="mb-6">
          <a
            href="/listings"
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Listings
          </a>
        </div>

        {/* Listing Header Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                isJob
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-100"
              }`}
            >
              {isJob ? (
                <Briefcase className="w-3.5 h-3.5" />
              ) : (
                <HeartHandshake className="w-3.5 h-3.5" />
              )}
              {listing.type}
            </span>

            <span className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-1 text-gray-400" />
              Posted on {new Date(listing.created_at).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
            {listing.title}
          </h1>

          {listing.location && (
            <div className="flex items-center text-gray-600 text-sm mb-6">
              <MapPin className="w-4 h-4 mr-1.5 text-emerald-600" />
              {listing.location}
            </div>
          )}

          <hr className="border-gray-100 my-6" />

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              About the Role
            </h3>
            <div className="text-gray-700 text-base leading-relaxed whitespace-pre-line">
              {listing.description}
            </div>
          </div>
        </div>

        {/* Application Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Apply for this Position
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Fill out the form below to submit your application directly to the
            organization.
          </p>

          {existingApplication ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl font-medium text-sm">
              ✓ You have already successfully applied for this position.
            </div>
          ) : (
            <form action={submitApplication} className="space-y-6">
              <input type="hidden" name="listingId" value={listing.id} />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={profile?.full_name || ""}
                  placeholder="Enter your full name"
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Message / Statement of Interest
                </label>
                <textarea
                  name="coverMessage"
                  required
                  rows={5}
                  placeholder="Tell us why you are a great fit for this role..."
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium transition-colors shadow-sm"
              >
                Submit Application
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
