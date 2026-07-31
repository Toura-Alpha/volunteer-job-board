import Link from "next/link";
import { MapPin, Calendar, ArrowRight } from "lucide-react";

interface ListingProps {
  id: string;
  title: string;
  description: string;
  location?: string | null;
  type: string;
  created_at: string;
}

export default function ListingCard({
  id,
  title,
  description,
  location,
  type,
  created_at,
}: ListingProps) {
  const isJob = type === "job";

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="text-lg font-semibold text-gray-900 leading-snug">
            {title}
          </h3>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 ${
              isJob
                ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
            }`}
          >
            {type}
          </span>
        </div>

        <div className="flex items-center text-gray-500 text-sm space-x-4 mb-4">
          {location && (
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-emerald-600 shrink-0" />
              {location}
            </span>
          )}
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-gray-400 shrink-0" />
            {new Date(created_at).toLocaleDateString()}
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-3 mb-6">{description}</p>
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs font-medium text-gray-400">Open Position</span>
        <Link
          href={`/listings/${id}`}
          className="inline-flex items-center space-x-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 group"
        >
          <span>View & Apply</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
