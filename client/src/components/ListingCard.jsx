import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/axios";

export default function ListingCard({ listing }) {
  const [saved, setSaved] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="group relative flex flex-col rounded-3xl overflow-hidden bg-white cursor-pointer"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)" }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={listing.image}
          alt={listing.title}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Skeleton while loading */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-stone-100 animate-pulse" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Save / Heart button */}
        <button
          onClick={async (e) => {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem("userInfo") || "null");
            if (!user?.token) return alert("Please login first");
            await api.post(`/favorites/${listing._id}`);
            setSaved(true);
          }}
          aria-label={saved ? "Remove from saved" : "Save listing"}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5 transition-colors duration-200"
            fill={saved ? "#FF385C" : "none"}
            stroke={saved ? "#FF385C" : "#1a1a1a"}
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            />
          </svg>
        </button>

        {/* Tag badge */}
        {listing.tag && (
          <span className="absolute top-3 left-3 z-10 text-xs font-semibold bg-white/90 backdrop-blur-sm text-stone-800 px-2.5 py-1 rounded-full shadow-sm">
            {listing.tag}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 gap-1">
        {/* Title + Rating row */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-[15px] font-semibold text-stone-900 leading-snug line-clamp-1 flex-1">
            {listing.title}
          </h2>
          {listing.rating && (
            <div className="flex items-center gap-1 shrink-0">
              <svg viewBox="0 0 20 20" fill="#FF385C" className="w-3.5 h-3.5">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-[13px] font-medium text-stone-800">
                {listing.rating}
              </span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-stone-400">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-[13px] text-stone-400 truncate">{listing.location}</p>
        </div>

        {/* Divider */}
        <div className="my-2 h-px bg-stone-100" />

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[17px] font-bold text-stone-900">
              ₹{listing.price.toLocaleString("en-IN")}
            </span>
            <span className="text-[13px] text-stone-400 font-normal"> / night</span>
          </div>

          <Link
            to={`/listings/${listing._id}`}
            className="text-[13px] font-semibold text-white px-4 py-2 rounded-xl transition-all duration-200 active:scale-95"
            style={{ background: "linear-gradient(135deg, #FF385C 0%, #FF6B6B 100%)" }}
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
