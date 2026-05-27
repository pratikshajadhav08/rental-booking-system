import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import SearchBar from "../components/SearchBar";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&auto=format&fit=crop",
];

const DESTINATIONS = [
  { city: "Goa",      img: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&auto=format&fit=crop", tag: "Beachfront" },
  { city: "Manali",   img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop", tag: "Mountains" },
  { city: "Jaipur",   img: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?w=400&auto=format&fit=crop", tag: "Heritage" },
  { city: "Kerala",   img: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&auto=format&fit=crop", tag: "Backwaters" },
  { city: "Coorg",    img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&auto=format&fit=crop", tag: "Nature" },
];

const TRUST_POINTS = [
  { icon: "🛡️", title: "Verified listings",   sub: "Every property is reviewed and verified by our team." },
  { icon: "💬", title: "24/7 support",         sub: "Round-the-clock help whenever you need it." },
  { icon: "✅", title: "Instant booking",      sub: "Confirm your stay in seconds, no back-and-forth." },
  { icon: "💰", title: "Best price guarantee", sub: "Found it cheaper? We'll match it." },
];

function SkeletonCard() {
  return (
    <div className="rounded-3xl overflow-hidden bg-white animate-pulse">
      <div className="aspect-[4/3] bg-stone-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-stone-200 rounded-full w-3/4" />
        <div className="h-3 bg-stone-100 rounded-full w-1/2" />
        <div className="h-px bg-stone-100" />
        <div className="flex justify-between">
          <div className="h-5 bg-stone-200 rounded-full w-1/3" />
          <div className="h-8 bg-stone-200 rounded-xl w-16" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [listings, setListings]               = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [heroIdx, setHeroIdx]                 = useState(0);
  const [searched, setSearched]               = useState(false);
  const listingsRef                           = useRef(null);

  // Hero auto-slide
  useEffect(() => {
    const timer = setInterval(
      () => setHeroIdx((i) => (i + 1) % HERO_IMAGES.length),
      5000
    );
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { fetchListings(); }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/listings");
      setListings(data);
      setFilteredListings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (filters) => {
    try {
      setLoading(true);
      setSearched(true);
      const { data } = await api.get("/listings", {
        params: {
          location: filters.where,
          guests:   filters.guests,
          checkIn:  filters.checkIn,
          checkOut: filters.checkOut,
        },
      });
      setFilteredListings(data);
      // Smooth scroll to results
      listingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#fafaf9" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-[620px] overflow-hidden">
        {/* Sliding background images */}
        {HERO_IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
            style={{ opacity: i === heroIdx ? 1 : 0 }}
          />
        ))}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        {/* Dot indicators */}
        <div className="absolute bottom-48 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === heroIdx ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Hero text + search */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
          <span className="inline-block text-white/70 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
            Find · Book · Explore
          </span>
          <h1 className="text-5xl md:text-[64px] font-extrabold text-white leading-tight max-w-3xl mb-5"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.35)" }}>
            Find Your Perfect Stay
          </h1>
          <p className="text-white/80 text-lg max-w-xl mb-10 leading-relaxed">
            Discover handpicked apartments, villas, heritage homes, and more across India.
          </p>

          {/* Search bar slot — passes handleSearch down */}
          <div className="w-full max-w-4xl">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_POINTS.map(({ icon, title, sub }) => (
            <div key={title} className="flex flex-col items-center text-center gap-2">
              <span className="text-3xl">{icon}</span>
              <p className="text-[14px] font-bold text-stone-800">{title}</p>
              <p className="text-[12px] text-stone-400 leading-relaxed">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TOP DESTINATIONS ── */}
      {!searched && (
        <section className="max-w-7xl mx-auto px-6 py-14">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">Handpicked for you</p>
              <h2 className="text-[26px] font-extrabold text-stone-900">Top Destinations</h2>
            </div>
            <button className="text-sm font-semibold text-stone-500 underline underline-offset-2 hover:text-stone-800 transition">
              Explore all →
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {DESTINATIONS.map(({ city, img, tag }, i) => (
              <div
                key={city}
                className={`relative rounded-3xl overflow-hidden cursor-pointer group ${
                  i === 0 ? "col-span-2 row-span-2 md:col-span-1 md:row-span-1 lg:col-span-2 lg:row-span-2" : ""
                }`}
                style={{ minHeight: i === 0 ? "280px" : "160px" }}
              >
                <img
                  src={img}
                  alt={city}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                  style={{ transition: "transform 0.5s ease" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-white font-bold text-[15px] leading-none">{city}</p>
                  <p className="text-white/70 text-[11px] mt-1">{tag}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── LISTINGS SECTION ── */}
      <section
        ref={listingsRef}
        className="max-w-7xl mx-auto px-6 py-10 pb-20"
      >
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">
              {searched ? "Search results" : "Featured stays"}
            </p>
            <h2 className="text-[26px] font-extrabold text-stone-900">
              {searched ? "Properties Found" : "Explore Stays"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {!loading && (
              <span className="text-sm text-stone-400 font-medium">
                {filteredListings.length} {filteredListings.length === 1 ? "property" : "properties"}
              </span>
            )}
            {searched && (
              <button
                onClick={() => { setSearched(false); setFilteredListings(listings); }}
                className="flex items-center gap-1.5 text-sm font-semibold text-stone-600 border border-stone-200 rounded-xl px-3 py-1.5 hover:bg-stone-50 transition"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
                </svg>
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-stone-100">
            <span className="text-5xl">🔍</span>
            <h3 className="text-xl font-bold text-stone-800 mt-4 mb-2">No listings found</h3>
            <p className="text-stone-400 text-sm mb-6">Try a different location, date, or guest count.</p>
            <button
              onClick={() => { setSearched(false); setFilteredListings(listings); }}
              className="text-sm font-bold text-white bg-stone-900 rounded-2xl px-6 py-3 hover:bg-stone-700 transition"
            >
              Show all listings
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredListings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}