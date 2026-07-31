import Link from "next/link";
import { LogOut, User } from "lucide-react";

interface NavbarProps {
  userEmail?: string | null;
}

export default function Navbar({ userEmail }: NavbarProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="bg-emerald-600 text-white font-bold p-2 rounded-lg text-sm">
            VC
          </span>
          <span className="font-bold text-xl text-gray-900">
            VolunteerConnect
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {userEmail ? (
            <div className="flex items-center space-x-4">
              <Link
                href="/profile"
                className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all"
                title="Profile"
              >
                <User className="w-5 h-5" />
              </Link>

              <span className="text-sm text-gray-600 hidden sm:inline">
                {userEmail}
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
            <Link
              href="/login"
              className="text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors"
            >
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
