import Link from "next/link";
import { Briefcase, HeartHandshake, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <header className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
          Find your next job or volunteer role
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
          A simple platform connecting people with meaningful paid work and
          local volunteer opportunities.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/listings"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
          >
            View All Listings
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            href="/listings/new"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          >
            Post a Position
          </Link>
        </div>
      </header>

      {/* Two Categories */}
      <main className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Jobs Card */}
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Job Openings
            </h2>
            <p className="text-gray-600 mb-4">
              Explore full-time, part-time, and freelance contracts with
              companies offering competitive pay.
            </p>
            <Link
              href="/listings?type=job"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Browse Jobs →
            </Link>
          </div>

          {/* Volunteer Card */}
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit mb-4">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Volunteer Roles
            </h2>
            <p className="text-gray-600 mb-4">
              Give back to your local community by joining impactful nonprofit
              initiatives and neighborhood projects.
            </p>
            <Link
              href="/listings?type=volunteer"
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Browse Volunteer Work →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
