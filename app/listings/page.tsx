import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import ListingsHero from "@/components/listings/ListingsHero";
import ListingCard from "@/components/listings/ListingCard";
import { UserCircle } from "lucide-react";
import { Key } from "react";

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
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );
}

export default async function ListingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: listings, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userEmail={user?.email} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ListingsHero />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Jobs & Volunteer Roles
          </h2>
          <span className="text-sm font-medium text-gray-500">
            {listings ? `${listings.length} positions available` : "Loading..."}
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
            Failed to load listings. Please check your database connection.
          </div>
        )}

        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(
              (listing: {
                id: string;
                title: string;
                description: string;
                location: string | null | undefined;
                type: string;
                created_at: string;
              }) => (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  description={listing.description}
                  location={listing.location}
                  type={listing.type}
                  created_at={listing.created_at}
                />
              ),
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <UserCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">
              No active positions
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Check back soon for new job and volunteer openings.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
