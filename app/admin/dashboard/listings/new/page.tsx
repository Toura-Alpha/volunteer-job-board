import { createListing } from "@/app/actions/listings";
import Link from "next/link";
import { ArrowLeft, Briefcase } from "lucide-react";

export default function NewListingPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          href="/admin/dashboard/listings"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 mb-4 bg-white border border-gray-200 px-3 py-1.5 rounded-xl shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Listings
        </Link>
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <Briefcase className="w-4 h-4" /> Position Builder
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          Create New Opportunity
        </h1>
        <p className="text-sm text-gray-500">
          Publish a new job or volunteer opening to the public board.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
        <form action={createListing} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
              Position Title
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Junior Frontend Developer (Volunteer)"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
              Organization Name
            </label>
            <input
              type="text"
              name="organization"
              required
              placeholder="e.g. HealthTech Cameroon"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              required
              placeholder="e.g. Buea, Cameroon"
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
              Full Description & Requirements
            </label>
            <textarea
              name="description"
              rows={5}
              required
              placeholder="Outline expectations, skills required, and impact..."
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors text-sm shadow-sm"
          >
            Publish Listing
          </button>
        </form>
      </div>
    </div>
  );
}
