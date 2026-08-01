import { getAdminUsers, updateUserRoleAndPass } from "@/app/actions/admin";
import {
  Shield,
  User,
  MapPin,
  Phone,
  Calendar,
  Info,
  Mail,
} from "lucide-react";

export default async function AdminUsersPage() {
  const allUsers = await getAdminUsers().catch(() => []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <Shield className="w-4 h-4" /> Access Control
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          User Management & Admin Access
        </h1>
        <p className="text-sm text-gray-600">
          Review all registered system users by email, manage roles, and
          authorize administrative changes securely.
        </p>
      </div>

      <div className="space-y-4">
        {allUsers.length > 0 ? (
          allUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4"
            >
              {/* User Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center font-bold">
                    <User className="w-5 h-5 text-gray-700" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-indigo-600" />{" "}
                        {user.email}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          user.role === "admin"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Info Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                  <span className="font-semibold text-gray-900">Location:</span>
                  <span>{user.location || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                  <span className="font-semibold text-gray-900">Phone:</span>
                  <span>{user.phone || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
                  <span className="font-semibold text-gray-900">Joined:</span>
                  <span>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
                {user.bio && (
                  <div className="sm:col-span-3 flex items-start gap-2 pt-2 border-t border-gray-200/80 text-gray-700">
                    <Info className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-gray-900">Bio: </span>
                      <span>{user.bio}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Edit Form & Admin Authorization Prompt */}
              <form action={updateUserRoleAndPass} className="space-y-4 pt-2">
                <input type="hidden" name="userId" value={user.id} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Target Role
                    </label>
                    <select
                      name="role"
                      defaultValue={user.role}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="applicant">Applicant</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Target Admin Database Password (if Admin)
                    </label>
                    <input
                      type="password"
                      name="adminPassword"
                      placeholder="Password for this account..."
                      defaultValue={user.admin_password}
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Authorization Prompt Box */}
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-indigo-950">
                      🔒 Security Authorization Required
                    </label>
                    <p className="text-xs text-indigo-800 font-medium">
                      Enter your own admin password to confirm these permission
                      changes.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="password"
                      name="authorizingPassword"
                      required
                      placeholder="Your admin password..."
                      className="p-2.5 bg-white border border-indigo-300 rounded-xl text-sm font-medium text-gray-900 w-48 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shrink-0"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-600 bg-white rounded-2xl border border-gray-200 font-medium">
            No registered users found.
          </div>
        )}
      </div>
    </div>
  );
}
