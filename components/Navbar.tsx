import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { User, LogOut, Shield } from "lucide-react";

interface NavbarProps {
  isAdminRoute?: boolean;
}

export default async function Navbar({ isAdminRoute }: NavbarProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRole = "applicant";
  let isAdmin = false;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role) {
      userRole = profile.role;
      isAdmin = profile.role === "admin";
    }
  }

  const formattedRole = userRole.charAt(0).toUpperCase() + userRole.slice(1);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link
            href="/listings"
            className="text-xl font-extrabold text-emerald-600 tracking-tight"
          >
            VolunteerConnect
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              {isAdmin &&
                (isAdminRoute ? (
                  <Link
                    href="/listings"
                    className="text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    ← Back to Public Site
                  </Link>
                ) : (
                  <Link
                    href="/admin/dashboard"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin Portal</span>
                  </Link>
                ))}

              <Link
                href="/profile"
                className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
                title="Profile"
              >
                <User className="w-5 h-5" />
              </Link>

              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider hidden sm:inline ${
                  isAdmin
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                }`}
              >
                {formattedRole}
              </span>

              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="flex items-center space-x-1 text-sm font-medium text-red-600 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/login"
                className="text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
