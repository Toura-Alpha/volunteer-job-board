import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Navbar from "@/components/Navbar";
import { Lock } from "lucide-react";
import { revalidatePath } from "next/cache";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch role and password from database profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, admin_password")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect("/listings?error=unauthorized");
  }

  async function verifyAdminPassword(formData: FormData) {
    "use server";
    const inputPassword = formData.get("password") as string;

    const actionSupabase = await createClient();
    const {
      data: { user: actionUser },
    } = await actionSupabase.auth.getUser();
    if (!actionUser) return;

    const { data: actionProfile } = await actionSupabase
      .from("profiles")
      .select("admin_password")
      .eq("id", actionUser.id)
      .single();

    if (inputPassword === actionProfile?.admin_password) {
      const actionCookieStore = await cookies();
      actionCookieStore.set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24,
      });
      revalidatePath("/admin/dashboard");
    }
  }

  const isAdminAuthenticated =
    cookieStore.get("admin_session")?.value === "authenticated";

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-white space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto border border-indigo-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold">Admin Database Password</h1>
            <p className="text-xs text-slate-400">
              Enter the password configured in your database profile.
            </p>
          </div>

          <form action={verifyAdminPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Database Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••••••"
                className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors text-sm shadow-sm"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar isAdminRoute={true} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
