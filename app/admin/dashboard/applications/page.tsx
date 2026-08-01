import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Users } from "lucide-react";

interface ApplicationRecord {
  id: string;
  name: string;
  cover_message: string;
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

export default async function AdminApplicationsPage() {
  const supabase = await createClient();
  const { data: applications } = await supabase
    .from("applications")
    .select("id, name, cover_message, created_at, listings(title)")
    .order("created_at", { ascending: false });

  const typedApplications = (applications ||
    []) as unknown as ApplicationRecord[];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Candidate Applications
        </h1>
        <p className="text-sm text-gray-500">
          Inspect review statements and cover messages submitted by applicants.
        </p>
      </div>

      <div className="space-y-4">
        {typedApplications.length > 0 ? (
          typedApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {app.name}
                  </h3>
                  <p className="text-xs text-indigo-600 font-medium">
                    Position: {app.listings?.title || "Unknown Position"}
                  </p>
                </div>
                <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                  Applied on {new Date(app.created_at).toLocaleString()}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Cover Message / Statement
                </h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-line leading-relaxed">
                  {app.cover_message}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center text-gray-500">
            <Users className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            <p>No candidate submissions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
