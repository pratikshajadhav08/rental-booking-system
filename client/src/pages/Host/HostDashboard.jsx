import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import { Home, IndianRupee, CalendarCheck, TrendingUp, Plus, ArrowRight, Star } from "lucide-react";

// Sparkline bar chart — no external dep needed
function SparkBar({ data = [], color = "#FF385C" }) {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end gap-0.5 h-10">
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm transition-all duration-500"
          style={{
            height: `${Math.max(8, (v / max) * 100)}%`,
            background: i === data.length - 1 ? color : `${color}55`,
          }}
        />
      ))}
    </div>
  );
}

const STAT_CARDS = [
  {
    key:    "totalListings",
    label:  "Properties",
    sub:    "Active listings",
    icon:   Home,
    color:  "#FF385C",
    bg:     "#fff5f6",
    spark:  [3, 3, 4, 4, 5, 5, 5],
    trend:  "+1 this month",
    trendUp: true,
  },
  {
    key:    "totalBookings",
    label:  "Bookings",
    sub:    "All time",
    icon:   CalendarCheck,
    color:  "#10b981",
    bg:     "#f0fdf8",
    spark:  [8, 14, 11, 18, 15, 22, 28],
    trend:  "+12% vs last month",
    trendUp: true,
  },
  {
    key:    "totalEarnings",
    label:  "Earnings",
    sub:    "Total revenue",
    icon:   IndianRupee,
    color:  "#6366f1",
    bg:     "#f5f3ff",
    spark:  [4200, 6800, 5100, 9200, 7400, 11000, 13500],
    trend:  "+23% vs last month",
    trendUp: true,
    isCurrency: true,
  },
  {
    key:    "avgRating",
    label:  "Avg. Rating",
    sub:    "Across all listings",
    icon:   Star,
    color:  "#f59e0b",
    bg:     "#fffbeb",
    spark:  [4.5, 4.6, 4.7, 4.7, 4.8, 4.9, 4.9],
    trend:  "↑ improving",
    trendUp: true,
    isRating: true,
  },
];

const QUICK_ACTIONS = [
  { label: "Add listing",    icon: Plus,          to: "/host/add-property", color: "#FF385C" },
  { label: "View bookings",  icon: CalendarCheck, to: "/host/bookings", color: "#10b981" },
  { label: "My listings",    icon: Home,          to: "/host/listings", color: "#6366f1" },
  { label: "Earnings",       icon: TrendingUp,    to: "/host/earnings", color: "#f59e0b" },
];

function StatusBadge({ status }) {
  const map = {
    confirmed: { bg: "#f0fdf8", text: "#059669", label: "Confirmed" },
    pending:   { bg: "#fffbeb", text: "#d97706", label: "Pending" },
    cancelled: { bg: "#fff5f6", text: "#e11d48", label: "Cancelled" },
  };
  const s = map[status] ?? map.pending;
  return (
    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
      style={{ background: s.bg, color: s.text }}>
      {s.label}
    </span>
  );
}

export default function HostDashboard() {
  const [stats, setStats]     = useState({
    totalListings: 0,
    totalBookings: 0,
    totalEarnings: 0,
    avgRating: 0,
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [userName, setUserName] = useState("Host");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo") ?? "{}");
    if (user?.name) setUserName(user.name.split(" ")[0]);
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const [dashRes, bookRes] = await Promise.all([
        api.get("/host/dashboard"),
        api.get("/host/bookings/recent").catch(() => ({ data: [] })),
      ]);
      setStats(dashRes.data);
      setBookings(bookRes.data.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n) => Number(n).toLocaleString("en-IN");

  const getValue = (card) => {
    const v = stats[card.key] ?? 0;
    if (card.isCurrency) return `₹${fmt(v)}`;
    if (card.isRating)   return Number(v).toFixed(1);
    return v;
  };

  return (
    <div className="min-h-screen" style={{ background: "#fafaf9" }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* ── PAGE HEADER ── */}
        <div className="flex items-start justify-between mb-10 gap-4 flex-wrap">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">
              Welcome back
            </p>
            <h1 className="text-[28px] font-extrabold text-stone-900">
              {userName}'s Dashboard
            </h1>
          </div>
          <Link
            to="/host/add-property"
            className="flex items-center gap-2 text-sm font-bold text-white rounded-2xl px-5 py-3 transition active:scale-95"
            style={{ background: "linear-gradient(135deg,#FF385C,#E31C5F)" }}
          >
            <Plus size={16} />
            Add listing
          </Link>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {STAT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.key}
                className="bg-white rounded-3xl p-5 border border-stone-100 flex flex-col gap-4"
                style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
              >
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center"
                    style={{ background: card.bg }}
                  >
                    <Icon size={20} style={{ color: card.color }} />
                  </div>
                  <span
                    className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                    style={{
                      background: card.trendUp ? "#f0fdf8" : "#fff5f6",
                      color:      card.trendUp ? "#059669" : "#e11d48",
                    }}
                  >
                    {card.trend}
                  </span>
                </div>

                {/* Value */}
                <div>
                  <p className="text-[13px] text-stone-400 font-medium mb-1">{card.label}</p>
                  {loading ? (
                    <div className="h-8 w-24 bg-stone-100 rounded-xl animate-pulse" />
                  ) : (
                    <p className="text-[28px] font-extrabold text-stone-900 leading-none">
                      {getValue(card)}
                    </p>
                  )}
                  <p className="text-[11px] text-stone-400 mt-1">{card.sub}</p>
                </div>

                {/* Sparkline */}
                <SparkBar data={card.spark} color={card.color} />
              </div>
            );
          })}
        </div>

        {/* ── BOTTOM GRID ── */}
        <div className="grid lg:grid-cols-3 gap-5">

          {/* Recent bookings — 2 cols */}
          <div
            className="lg:col-span-2 bg-white rounded-3xl border border-stone-100 overflow-hidden"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
              <h2 className="text-[16px] font-bold text-stone-900">Recent Bookings</h2>
              <Link
                to="/host/bookings"
                className="flex items-center gap-1 text-[12px] font-semibold text-stone-400 hover:text-stone-700 transition"
              >
                View all <ArrowRight size={13} />
              </Link>
            </div>

            {loading ? (
              <div className="divide-y divide-stone-50">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                    <div className="w-10 h-10 rounded-xl bg-stone-100 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-stone-100 rounded-full w-2/3" />
                      <div className="h-3 bg-stone-50 rounded-full w-1/3" />
                    </div>
                    <div className="h-6 w-20 bg-stone-100 rounded-full" />
                  </div>
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
                <span className="text-4xl">📋</span>
                <p className="font-bold text-stone-700">No bookings yet</p>
                <p className="text-sm text-stone-400">Bookings for your listings will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-50">
                {bookings.map((b) => (
                  <div key={b._id} className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50 transition">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 font-bold text-sm shrink-0">
                      {b.user?.name?.[0]?.toUpperCase() ?? "G"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-stone-800 truncate">
                        {b.listing?.title ?? "Listing"}
                      </p>
                      <p className="text-[12px] text-stone-400 mt-0.5">
                        {b.user?.name} · {Math.max(1, Math.ceil((new Date(b.checkOut) - new Date(b.checkIn)) / 86400000))} nights · ₹{fmt(b.totalPrice ?? 0)}
                      </p>
                    </div>
                    <StatusBadge status={b.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">

            {/* Quick actions */}
            <div
              className="bg-white rounded-3xl border border-stone-100 p-5"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
            >
              <h2 className="text-[16px] font-bold text-stone-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_ACTIONS.map(({ label, icon: Icon, to, color }) => (
                  <Link
                    key={label}
                    to={to}
                    className="flex flex-col items-center justify-center gap-2 rounded-2xl py-4 transition hover:opacity-90 active:scale-95 text-center"
                    style={{ background: `${color}12` }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: `${color}22` }}
                    >
                      <Icon size={16} style={{ color }} />
                    </div>
                    <span className="text-[12px] font-bold" style={{ color }}>
                      {label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Occupancy rate */}
            <div
              className="bg-white rounded-3xl border border-stone-100 p-5 flex flex-col gap-3"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-bold text-stone-900">Occupancy</h2>
                <span className="text-[12px] font-bold text-stone-400">This month</span>
              </div>

              {/* Ring chart */}
              <div className="flex items-center gap-5">
                <div className="relative w-20 h-20 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f0ede8" strokeWidth="3.5" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke="#FF385C" strokeWidth="3.5"
                      strokeDasharray="72 100"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[15px] font-extrabold text-stone-900">72%</span>
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  {[
                    { label: "Booked", pct: 72, color: "#FF385C" },
                    { label: "Available", pct: 20, color: "#10b981" },
                    { label: "Blocked", pct: 8, color: "#e5e2de" },
                  ].map(({ label, pct, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-[11px] font-semibold text-stone-500 mb-1">
                        <span>{label}</span><span>{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
