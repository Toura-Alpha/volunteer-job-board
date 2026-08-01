import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, User, Shield, Mail, Calendar } from "lucide-react";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back to Home Button */}
        <div>
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-emerald-600 bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">
          <div className="flex items-center space-x-4 border-b border-gray-100 pb-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Account Profile
              </h1>
              <p className="text-sm text-gray-500">
                Manage your account information and role settings.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium">Email Address</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {user?.email}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center space-x-3 text-gray-600">
                <Shield className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium">System Role</span>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider ${
                  profile?.role === "admin"
                    ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                }`}
              >
                {profile?.role || "applicant"}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex items-center space-x-3 text-gray-600">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium">Member Since</span>
              </div>
              <span className="text-sm text-gray-600">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
