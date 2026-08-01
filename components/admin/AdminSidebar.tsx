import Link from "next/link";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  ArrowLeft,
  Shield,
} from "lucide-react";

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-[calc(100vh-4rem)] border-r border-slate-800">
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
        <div className="p-2 bg-indigo-600 text-white rounded-xl">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-bold text-white text-base">Admin Panel</h2>
          <p className="text-xs text-slate-400">VolunteerConnect OS</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1.5">
        <Link
          href="/admin/dashboard"
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LayoutDashboard className="w-5 h-5 text-indigo-400" />
          <span>Dashboard Overview</span>
        </Link>

        <Link
          href="/admin/dashboard/listings"
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Briefcase className="w-5 h-5 text-emerald-400" />
          <span>Manage Listings</span>
        </Link>

        <Link
          href="/admin/dashboard/applications"
          className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Users className="w-5 h-5 text-cyan-400" />
          <span>Review Applications</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link
          href="/listings"
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Public Site</span>
        </Link>
      </div>
    </aside>
  );
}
