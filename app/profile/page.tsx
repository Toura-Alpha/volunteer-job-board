import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import { updateProfile } from "@/app/actions/profile";

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

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userEmail={user?.email} />

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            User Profile
          </h1>

          <form action={updateProfile} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                name="fullName"
                type="text"
                defaultValue={profile?.full_name || ""}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                rows={3}
                defaultValue={profile?.bio || ""}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  type="tel"
                  defaultValue={profile?.phone || ""}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  name="location"
                  type="text"
                  defaultValue={profile?.location || ""}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors"
            >
              Save Profile
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
