import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  Briefcase,
  Users,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface RecentApplication {
  id: string;
  name: string;
  created_at: string;
  listings: {
    title: string;
  } | null;
}

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

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const { count: listingsCount } = await supabase
    .from("listings")
    .select("*", { count: "exact", head: true });
  const { count: applicationsCount } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true });
  const { data: recentApps } = await supabase
    .from("applications")
    .select("id, name, created_at, listings(title)")
    .order("created_at", { ascending: false })
    .limit(5);

  const typedRecentApps = (recentApps || []) as unknown as RecentApplication[];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-8 text-white shadow-xl flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-indigo-800/80 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4" /> System Overview
          </div>
          <h1 className="text-3xl font-extrabold">Welcome, Administrator</h1>
          <p className="text-indigo-200 text-sm mt-1">
            Here is the real-time operational status of VolunteerConnect.
          </p>
        </div>
        <Link
          href="/admin/dashboard/listings"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-xl transition-colors text-sm shadow-sm flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Manage Openings
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total Active Listings
            </p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              {listingsCount || 0}
            </h3>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Total Applications Received
            </p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">
              {applicationsCount || 0}
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            Recent Candidate Submissions
          </h3>
          <Link
            href="/admin/dashboard/applications"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {typedRecentApps.length > 0 ? (
            typedRecentApps.map((app) => (
              <div
                key={app.id}
                className="p-6 flex items-center justify-between hover:bg-gray-50/50"
              >
                <div>
                  <h4 className="font-semibold text-gray-900">{app.name}</h4>
                  <p className="text-xs text-gray-500">
                    Applied for:{" "}
                    <span className="font-medium text-indigo-600">
                      {app.listings?.title || "Unknown Position"}
                    </span>
                  </p>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(app.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No applications recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
