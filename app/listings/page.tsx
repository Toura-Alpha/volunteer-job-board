import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import Navbar from "@/components/Navbar";
import ListingsHero from "@/components/listings/ListingsHero";
import ListingCard from "@/components/listings/ListingCard";
import {
  UserCircle,
  Search,
  MapPin,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );
}

interface PageProps {
  searchParams: Promise<{
    search?: string;
    location?: string;
    page?: string;
  }>;
}

export default async function ListingsPage({ searchParams }: PageProps) {
  const supabase = await createClient();
  const params = await searchParams;

  const search = params.search || "";
  const locationFilter = params.location || "all";
  const currentPage = Number(params.page) || 1;
  const pageSize = 6;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Build query with search, filter, exact count, and pagination range
  let query = supabase.from("listings").select("*", { count: "exact" });

  if (search) {
    query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (locationFilter && locationFilter !== "all") {
    query = query.ilike("location", `%${locationFilter}%`);
  }

  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data: listings, count, error } = await query;
  const totalPages = count ? Math.ceil(count / pageSize) : 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userEmail={user?.email} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <ListingsHero />

        {/* Search & Filter Bar */}
        <form
          method="GET"
          className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
        >
          <div className="relative md:col-span-6">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search titles or descriptions..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="relative md:col-span-4">
            <div className="absolute left-4 top-3.5 pointer-events-none">
              <MapPin className="w-4 h-4 text-gray-400" />
            </div>
            <select
              name="location"
              defaultValue={locationFilter}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Locations (Cameroon)</option>
              <option value="Buea">Buea</option>
              <option value="Douala">Douala</option>
              <option value="Yaoundé">Yaoundé</option>
              <option value="Bamenda">Bamenda</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </form>

        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            Jobs & Volunteer Roles
          </h2>
          <span className="text-sm font-medium text-gray-500">
            {count !== null && count !== undefined
              ? `${count} positions available`
              : "Loading..."}
          </span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            Failed to load listings. Please check your database connection.
          </div>
        )}

        {listings && listings.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(
                (listing: {
                  id: string;
                  title: string;
                  description: string;
                  location: string | null | undefined;
                  type: string;
                  created_at: string;
                }) => (
                  <ListingCard
                    key={listing.id}
                    id={listing.id}
                    title={listing.title}
                    description={listing.description}
                    location={listing.location}
                    type={listing.type}
                    created_at={listing.created_at}
                  />
                ),
              )}
            </div>

            {/* Pagination Bar */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-gray-200 shadow-sm mt-8">
                <div className="text-sm font-medium text-gray-600">
                  Page{" "}
                  <span className="font-bold text-gray-900">{currentPage}</span>{" "}
                  of{" "}
                  <span className="font-bold text-gray-900">{totalPages}</span>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={`/listings?search=${encodeURIComponent(search)}&location=${encodeURIComponent(locationFilter)}&page=${currentPage - 1}`}
                    aria-disabled={currentPage <= 1}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border border-gray-300 flex items-center gap-1.5 transition-colors ${
                      currentPage <= 1
                        ? "opacity-40 pointer-events-none bg-gray-50 text-gray-400 border-gray-200"
                        : "bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </a>

                  <a
                    href={`/listings?search=${encodeURIComponent(search)}&location=${encodeURIComponent(locationFilter)}&page=${currentPage + 1}`}
                    aria-disabled={currentPage >= totalPages}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border border-gray-300 flex items-center gap-1.5 transition-colors ${
                      currentPage >= totalPages
                        ? "opacity-40 pointer-events-none bg-gray-50 text-gray-400 border-gray-200"
                        : "bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <UserCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">
              No active positions found
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Try adjusting your search criteria or check back later.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
