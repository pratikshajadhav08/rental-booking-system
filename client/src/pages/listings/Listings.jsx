import { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import ListingCard from "../../components/ListingCard";

const CATEGORIES = [
  { id: "all",     label: "All",        icon: "🏠" },
  { id: "beach",   label: "Beachfront", icon: "🏖️" },
  { id: "mountain",label: "Mountains",  icon: "⛰️" },
  { id: "city",    label: "City",       icon: "🏙️" },
  { id: "heritage",label: "Heritage",   icon: "🏰" },
  { id: "villa",   label: "Villas",     icon: "🏡" },
  { id: "cabin",   label: "Cabins",     icon: "🪵" },
  { id: "farm",    label: "Farms",      icon: "🌾" },
];

const SORT_OPTIONS = [
  { value: "default",   label: "Recommended" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc",label: "Price: High to Low" },
  { value: "rating",    label: "Top Rated" },
];

function SkeletonCard() {
  return (
    <div className="rounded-3xl overflow-hidden bg-white animate-pulse">
      <div className="aspect-[4/3] bg-stone-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-stone-200 rounded-full w-3/4" />
        <div className="h-3 bg-stone-100 rounded-full w-1/2" />
        <div className="h-px bg-stone-100" />
        <div className="flex justify-between items-center">
          <div className="h-5 bg-stone-200 rounded-full w-1/3" />
          <div className="h-8 bg-stone-200 rounded-xl w-16" />
        </div>
      </div>
    </div>
  );
}

export default function Listings() {
  const [listings, setListings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [activeCategory, setCategory] = useState("all");
  const [sortBy, setSortBy]           = useState("default");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange]   = useState([0, 50000]);
  const [minPrice, setMinPrice]       = useState(0);
  const [maxPrice, setMaxPrice]       = useState(50000);

  useEffect(() => { fetchListings(); }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/listings");
      setListings(data);
      if (data.length) {
        const prices = data.map((l) => l.price);
        const lo = Math.min(...prices);
        const hi = Math.max(...prices);
        setMinPrice(lo);
        setMaxPrice(hi);
        setPriceRange([lo, hi]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = listings
    .filter((l) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q);
      const matchCategory =
        activeCategory === "all" ||
        l.category === activeCategory;
      const matchPrice =
        l.price >= priceRange[0] && l.price <= priceRange[1];
      return matchSearch && matchCategory && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc")  return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "rating")     return (b.rating ?? 0) - (a.rating ?? 0);
      return 0;
    });

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSortBy("default");
    setPriceRange([minPrice, maxPrice]);
  };

  const hasActiveFilters =
    search || activeCategory !== "all" || sortBy !== "default" ||
    priceRange[0] !== minPrice || priceRange[1] !== maxPrice;

  return (
    <div className="min-h-screen" style={{ background: "#fafaf9" }}>
      <Navbar />

      {/* ── HERO SEARCH BAR ── */}
      <div className="bg-white border-b border-stone-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">

          {/* Search input */}
          <div className="flex-1 flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 focus-within:border-stone-400 focus-within:bg-white transition-all">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-stone-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destinations, cities, places…"
              className="flex-1 bg-transparent text-sm text-stone-800 placeholder-stone-400 outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-stone-400 hover:text-stone-600 transition">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="hidden sm:block text-sm font-medium bg-stone-50 border border-stone-200 text-stone-700 rounded-2xl px-4 py-3 outline-none cursor-pointer hover:border-stone-400 transition"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 text-sm font-semibold rounded-2xl px-4 py-3 border transition-all ${
              showFilters
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400"
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 12h10M11 20h2" />
            </svg>
            Filters
          </button>
        </div>

        {/* ── FILTER PANEL ── */}
        {showFilters && (
          <div className="border-t border-stone-100 bg-white px-6 py-5 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Price per night</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
                    <span className="text-xs text-stone-400">Min</span>
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
                      className="w-20 text-sm font-semibold text-stone-800 bg-transparent outline-none"
                    />
                  </div>
                  <div className="h-px w-4 bg-stone-300" />
                  <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
                    <span className="text-xs text-stone-400">Max</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
                      className="w-20 text-sm font-semibold text-stone-800 bg-transparent outline-none"
                    />
                  </div>
                  <span className="text-sm text-stone-500">
                    ₹{priceRange[0].toLocaleString("en-IN")} – ₹{priceRange[1].toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="sm:block">
                <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3 sm:hidden">Sort</p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sm:hidden text-sm font-medium bg-stone-50 border border-stone-200 text-stone-700 rounded-xl px-3 py-2 outline-none w-full"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-sm font-semibold text-rose-500 hover:text-rose-600 transition"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
                  </svg>
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── CATEGORY TABS ── */}
        <div className="border-t border-stone-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-1 overflow-x-auto no-scrollbar py-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 shrink-0 text-sm font-semibold rounded-2xl px-4 py-2 transition-all whitespace-nowrap ${
                    activeCategory === cat.id
                      ? "bg-stone-900 text-white"
                      : "text-stone-500 hover:text-stone-800 hover:bg-stone-100"
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Result count */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Explore Stays</h1>
            {!loading && (
              <p className="text-sm text-stone-400 mt-1">
                {filtered.length} {filtered.length === 1 ? "property" : "properties"} found
                {activeCategory !== "all" && ` in ${CATEGORIES.find(c => c.id === activeCategory)?.label}`}
              </p>
            )}
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm font-semibold text-stone-600 underline underline-offset-2 hover:text-stone-900 transition"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-28 gap-4 text-center">
            <span className="text-6xl">🔍</span>
            <h2 className="text-xl font-bold text-stone-800">No listings found</h2>
            <p className="text-stone-400 text-sm max-w-xs">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={clearFilters}
              className="mt-2 text-sm font-semibold text-white bg-stone-900 rounded-2xl px-6 py-3 hover:bg-stone-700 transition"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </div>

      {/* Scrollbar hide utility */}
      <style>{`.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
    </div>
  );
}