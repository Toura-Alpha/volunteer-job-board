"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // 1. Authenticate credentials
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      setError(authError?.message || "Invalid login credentials");
      setLoading(false);
      return;
    }

    // 2. Strict Role Verification Check
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .single();

    if (profileError || !profile || profile.role !== "admin") {
      // Sign them out immediately if they are an applicant trying to access admin portal
      await supabase.auth.signOut();
      setError("Access Denied: Administrator privileges required.");
      setLoading(false);
      return;
    }

    // 3. Redirect to Admin Dashboard upon successful verification
    router.push("/admin/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
        <div>
          <span className="inline-block bg-indigo-500/10 text-indigo-400 text-xs font-semibold px-2.5 py-1 rounded-full mb-3">
            Admin Portal
          </span>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Admin Authentication
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Secure gateway for platform administrators
          </p>
        </div>

        {error && (
          <div
            className="bg-red-500/10 border-l-4 border-red-500 p-4 text-sm text-red-400"
            role="alert"
          >
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleAdminLogin}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 text-black sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 text-black sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying credentials..." : "Access Admin Dashboard"}
            </button>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="text-xs text-slate-400 hover:text-slate-200 underline"
            >
              Return to regular applicant login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
