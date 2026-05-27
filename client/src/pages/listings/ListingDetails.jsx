import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Navbar from "../../components/Navbar";

const AMENITIES = [
  { icon: "🛜", label: "Free WiFi" },
  { icon: "🍳", label: "Full Kitchen" },
  { icon: "🚗", label: "Free Parking" },
  { icon: "❄️", label: "Air Conditioning" },
  { icon: "🏊", label: "Pool" },
  { icon: "🧺", label: "Washer & Dryer" },
];

function AvatarCircle({ name }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 font-bold text-lg shrink-0">
      {initials}
    </div>
  );
}

function StarIcon({ filled = true, half = false }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className="w-4 h-4"
      fill={filled ? "#FF385C" : "none"}
      stroke="#FF385C"
      strokeWidth="1.5"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

export default function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");

  useEffect(() => {
    fetchListing();
  }, []);

  const fetchListing = async () => {
    try {
      const { data } = await api.get(`/listings/${id}`);
      setListing(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-20 space-y-4 animate-pulse">
          <div className="h-8 bg-stone-100 rounded-xl w-2/3" />
          <div className="h-5 bg-stone-100 rounded-xl w-1/4" />
          <div className="grid grid-cols-3 gap-2 mt-6">
            <div className="col-span-2 h-80 bg-stone-100 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-[156px] bg-stone-100 rounded-2xl" />
              <div className="h-[156px] bg-stone-100 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );

  if (!listing)
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <span className="text-5xl">🏠</span>
          <p className="text-stone-400 text-lg">Listing not found</p>
        </div>
      </div>
    );

  const nights =
    checkIn && checkOut
      ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)
      : 0;

  const subtotal = nights * listing.price;
  const cleaningFee = 800;
  const serviceFee = Math.round(subtotal * 0.12);
  const total = subtotal + (nights > 0 ? cleaningFee + serviceFee : 0);

  const handleBooking = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo") || "null");

      if (!user?.token) {
        return alert("Please login first");
      }

      if (user.role !== "user" && user.role !== "admin") {
        return alert("Host accounts manage listings from the host dashboard. Please use a user account to book stays.");
      }

      if (!checkIn || !checkOut || nights <= 0) {
        return alert("Please select valid check-in and check-out dates");
      }

      if (paymentMethod === "card" && cardNumber.replace(/\D/g, "").length < 12) {
        return alert("Please enter a valid card number for the mock payment.");
      }

      await api.post(
        "/bookings",
        {
          listing: listing._id,
          checkIn,
          checkOut,
          guests,
          paymentMethod,
          cardLast4:
            paymentMethod === "card"
              ? cardNumber.replace(/\D/g, "").slice(-4)
              : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      alert("Booking and payment saved successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6">
        {/* ── TITLE ROW ── */}
        <div className="py-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-stone-900 leading-tight">
              {listing.title}
            </h1>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    filled={i < Math.round(listing.rating ?? 5)}
                  />
                ))}
                <span className="text-sm font-semibold text-stone-800 ml-1">
                  {listing.rating ?? "4.97"}
                </span>
                <span className="text-sm text-stone-400">
                  · {listing.reviewCount ?? "128"} reviews
                </span>
              </div>
              <span className="text-stone-300">·</span>
              <span className="text-sm text-stone-500 underline underline-offset-2 cursor-pointer">
                {listing.location}
              </span>
            </div>
          </div>

          {/* Share + Save */}
          <div className="flex gap-2 shrink-0">
            <button className="flex items-center gap-1.5 text-sm font-semibold text-stone-700 border border-stone-200 rounded-full px-4 py-2 hover:bg-stone-50 transition">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Share
            </button>
            <button
              onClick={async () => {
                const user = JSON.parse(localStorage.getItem("userInfo") || "null");
                if (!user?.token) return alert("Please login first");
                await api.post(`/favorites/${listing._id}`);
                setSaved(true);
              }}
              className="flex items-center gap-1.5 text-sm font-semibold text-stone-700 border border-stone-200 rounded-full px-4 py-2 hover:bg-stone-50 transition"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4"
                fill={saved ? "#FF385C" : "none"}
                stroke={saved ? "#FF385C" : "currentColor"}
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* ── IMAGE GALLERY ── */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[480px] relative">
          <img
            src={listing.image}
            alt={listing.title}
            className="col-span-2 row-span-2 w-full h-full object-cover"
          />
          {[...Array(4)].map((_, i) => (
            <img
              key={i}
              src={listing.image}
              alt=""
              className="w-full h-full object-cover"
            />
          ))}
          <button className="absolute bottom-4 right-4 bg-white text-stone-800 text-sm font-semibold border border-stone-300 rounded-xl px-4 py-2 hover:bg-stone-50 transition shadow-sm flex items-center gap-1.5">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Show all photos
          </button>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="mt-10 grid md:grid-cols-3 gap-12 pb-20">
          {/* ── LEFT ── */}
          <div className="md:col-span-2 space-y-8">
            {/* Host intro */}
            <div className="flex items-center justify-between border-b pb-8">
              <div>
                <h2 className="text-[22px] font-semibold text-stone-900">
                  Entire place hosted by Rahul
                </h2>
                <p className="text-stone-500 mt-1 text-sm">
                  {listing.maxGuests ?? 4} guests · {listing.bedrooms ?? 2}{" "}
                  bedrooms · {listing.beds ?? 3} beds · {listing.bathrooms ?? 2}{" "}
                  bathrooms
                </p>
              </div>
              <AvatarCircle name="Rahul Sharma" />
            </div>

            {/* Highlights */}
            <div className="space-y-5 border-b pb-8">
              {[
                {
                  icon: "🏅",
                  title: "Rahul is a Superhost",
                  sub: "Superhosts are experienced, highly rated hosts.",
                },
                {
                  icon: "📍",
                  title: "Great location",
                  sub: "95% of recent guests gave the location a 5-star rating.",
                },
                {
                  icon: "🔑",
                  title: "Self check-in",
                  sub: "Check yourself in with the lockbox.",
                },
              ].map(({ icon, title, sub }) => (
                <div key={title} className="flex gap-4 items-start">
                  <span className="text-2xl mt-0.5">{icon}</span>
                  <div>
                    <p className="font-semibold text-stone-800 text-[15px]">
                      {title}
                    </p>
                    <p className="text-stone-500 text-sm mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="border-b pb-8">
              <p className="text-stone-600 leading-relaxed text-[15px]">
                {listing.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="border-b pb-8">
              <h3 className="text-[20px] font-semibold text-stone-900 mb-5">
                What this place offers
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {AMENITIES.map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 text-stone-700 text-[15px]"
                  >
                    <span className="text-xl">{icon}</span>
                    {label}
                  </div>
                ))}
              </div>
              <button className="mt-6 border border-stone-300 text-stone-800 font-semibold text-sm px-6 py-3 rounded-xl hover:bg-stone-50 transition">
                Show all amenities
              </button>
            </div>

            {/* Map placeholder */}
            <div>
              <h3 className="text-[20px] font-semibold text-stone-900 mb-4">
                Where you'll be
              </h3>
              <div className="rounded-2xl overflow-hidden bg-stone-100 h-56 flex items-center justify-center text-stone-400 text-sm">
                📍 {listing.location}
              </div>
            </div>
          </div>

          {/* ── RIGHT — BOOKING CARD ── */}
          <div className="md:col-span-1">
            <div
              className="sticky top-6 rounded-3xl border border-stone-200 p-6"
              style={{ boxShadow: "0 4px 32px rgba(0,0,0,0.10)" }}
            >
              {/* Price */}
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-[24px] font-bold text-stone-900">
                  ₹{listing.price.toLocaleString("en-IN")}
                </span>
                <span className="text-stone-500 text-sm">/ night</span>
                <div className="ml-auto flex items-center gap-1">
                  <StarIcon />
                  <span className="text-sm font-semibold text-stone-800">
                    {listing.rating ?? "4.97"}
                  </span>
                </div>
              </div>

              {/* Date picker */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden mb-3">
                <div className="grid grid-cols-2 divide-x divide-stone-200">
                  <div className="p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                      Check-in
                    </p>
                    <p className="text-sm text-stone-800 mt-0.5">
                      {checkIn
                        ? checkIn.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })
                        : "Add date"}
                    </p>
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                      Check-out
                    </p>
                    <p className="text-sm text-stone-800 mt-0.5">
                      {checkOut
                        ? checkOut.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })
                        : "Add date"}
                    </p>
                  </div>
                </div>
                <div className="border-t border-stone-200 p-2 flex justify-center">
                  <DatePicker
                    selected={checkIn}
                    onChange={(dates) => {
                      const [start, end] = dates;
                      setCheckIn(start);
                      setCheckOut(end);
                    }}
                    startDate={checkIn}
                    endDate={checkOut}
                    selectsRange
                    inline
                    minDate={new Date()}
                    calendarClassName="!border-0 !shadow-none !text-sm"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="border border-stone-200 rounded-2xl p-3 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                    Guests
                  </p>
                  <p className="text-sm text-stone-800 mt-0.5">
                    {guests} guest{guests !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-50 transition disabled:opacity-30"
                    disabled={guests <= 1}
                  >
                    −
                  </button>
                  <span className="text-sm font-semibold w-4 text-center">
                    {guests}
                  </span>
                  <button
                    onClick={() => setGuests((g) => Math.min(16, g + 1))}
                    className="w-8 h-8 rounded-full border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-50 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Reserve button */}
              <div className="border border-stone-200 rounded-2xl p-3 mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Payment
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[
                    ["card", "Card"],
                    ["upi", "UPI"],
                    ["wallet", "Wallet"],
                    ["pay_at_property", "Pay at property"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPaymentMethod(value)}
                      className={`text-xs font-bold rounded-xl border px-3 py-2 transition ${
                        paymentMethod === value
                          ? "border-rose-400 bg-rose-50 text-rose-600"
                          : "border-stone-200 text-stone-500 hover:bg-stone-50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                {paymentMethod === "card" && (
                  <input
                    value={cardNumber}
                    onChange={(event) => setCardNumber(event.target.value)}
                    inputMode="numeric"
                    placeholder="Card number"
                    className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm outline-none focus:border-stone-400"
                  />
                )}
                {paymentMethod !== "card" && (
                  <p className="text-xs text-stone-400">
                    This demo records your selected method and marks online payments as paid.
                  </p>
                )}
              </div>

              <button
                onClick={handleBooking}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-[15px] transition-all active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg, #FF385C 0%, #E31C5F 100%)",
                }}
              >
                {nights > 0
                  ? `Reserve · ₹${total.toLocaleString("en-IN")}`
                  : "Check availability"}
              </button>
              <p className="text-center text-stone-400 text-xs mt-2">
                You won't be charged yet
              </p>

              {/* Price breakdown */}
              {nights > 0 && (
                <div className="mt-4 space-y-2 text-sm text-stone-600 border-t pt-4">
                  <div className="flex justify-between">
                    <span>
                      ₹{listing.price.toLocaleString("en-IN")} × {nights} nights
                    </span>
                    <span>₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cleaning fee</span>
                    <span>₹{cleaningFee.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Airbnb service fee</span>
                    <span>₹{serviceFee.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-900 border-t pt-2 mt-2">
                    <span>Total</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
