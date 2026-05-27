import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";

function SkeletonCard() {
  return (
    <div className="rounded-3xl overflow-hidden bg-white animate-pulse border border-stone-100">
      <div className="aspect-[4/3] bg-stone-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-stone-200 rounded-full w-3/4" />
        <div className="h-3 bg-stone-100 rounded-full w-1/2" />
        <div className="h-px bg-stone-100" />
        <div className="flex justify-between">
          <div className="h-5 bg-stone-200 rounded-full w-1/3" />
          <div className="h-8 bg-stone-200 rounded-xl w-20" />
        </div>
      </div>
    </div>
  );
}

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [removing, setRemoving]   = useState(null); // id being removed

  useEffect(() => { fetchFavorites(); }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await api.get("/favorites/my", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFavorites(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (favId) => {
    try {
      setRemoving(favId);
      const user = JSON.parse(localStorage.getItem("userInfo"));
      await api.delete(`/favorites/${favId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFavorites((prev) => prev.filter((f) => f._id !== favId));
    } catch (err) {
      console.error(err);
    } finally {
      setRemoving(null);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#fafaf9" }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ── PAGE HEADER ── */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">Your collection</p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="text-[28px] font-extrabold text-stone-900">Saved Stays</h1>
            {!loading && favorites.length > 0 && (
              <span className="text-sm text-stone-400 font-medium mb-1">
                {favorites.length} {favorites.length === 1 ? "property" : "properties"}
              </span>
            )}
          </div>
        </div>

        {/* ── LOADING ── */}
        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && favorites.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 gap-5 text-center">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
              style={{ background: "linear-gradient(135deg,#fff5f6,#ffe4e8)" }}
            >
              🤍
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-800 mb-2">No saved stays yet</h2>
              <p className="text-stone-400 text-sm max-w-xs leading-relaxed">
                Tap the heart on any listing to save it here for later.
              </p>
            </div>
            <Link
              to="/listings"
              className="mt-2 text-sm font-bold text-white rounded-2xl px-6 py-3 transition active:scale-95"
              style={{ background: "linear-gradient(135deg,#FF385C,#E31C5F)" }}
            >
              Explore stays
            </Link>
          </div>
        )}

        {/* ── GRID ── */}
        {!loading && favorites.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {favorites.map((fav) => (
              <div
                key={fav._id}
                className="group relative bg-white rounded-3xl overflow-hidden border border-stone-100 transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 10px 32px rgba(0,0,0,0.10)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"}
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <img
                    src={fav.listing.image}
                    alt={fav.listing.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Remove / unsave button */}
                  <button
                    onClick={() => handleRemove(fav._id)}
                    disabled={removing === fav._id}
                    aria-label="Remove from saved"
                    className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-60"
                  >
                    {removing === fav._id ? (
                      <svg className="w-4 h-4 animate-spin text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#FF385C" stroke="#FF385C" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    )}
                  </button>

                  {/* Optional tag/badge */}
                  {fav.listing.tag && (
                    <span className="absolute top-3 left-3 text-xs font-semibold bg-white/90 backdrop-blur-sm text-stone-800 px-2.5 py-1 rounded-full shadow-sm">
                      {fav.listing.tag}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-[15px] font-bold text-stone-900 leading-snug line-clamp-1 flex-1">
                      {fav.listing.title}
                    </h2>
                    {fav.listing.rating && (
                      <div className="flex items-center gap-1 shrink-0">
                        <svg viewBox="0 0 20 20" fill="#FF385C" className="w-3.5 h-3.5">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-[13px] font-semibold text-stone-800">{fav.listing.rating}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mt-1.5">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-stone-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-[13px] text-stone-400 truncate">{fav.listing.location}</p>
                  </div>

                  <div className="h-px bg-stone-100 my-3" />

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[16px] font-bold text-stone-900">
                        ₹{fav.listing.price?.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[12px] text-stone-400"> / night</span>
                    </div>
                    <Link
                      to={`/listings/${fav.listing._id}`}
                      className="text-[12.5px] font-bold text-white px-4 py-2 rounded-xl transition active:scale-95"
                      style={{ background: "linear-gradient(135deg,#FF385C,#E31C5F)" }}
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}