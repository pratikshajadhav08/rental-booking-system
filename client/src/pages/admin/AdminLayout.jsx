import { Link, useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";

const links = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/listings", label: "Listings" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/reviews", label: "Reviews" },
  { to: "/admin/reports", label: "Reports" },
];

export default function AdminLayout({ title, children }) {
  const location = useLocation();

  return (
    <div className="min-h-screen" style={{ background: "#fafaf9" }}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
              Admin
            </p>
            <h1 className="text-3xl font-extrabold text-stone-900">{title}</h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-xl text-sm font-semibold ${
                  location.pathname === link.to
                    ? "bg-stone-900 text-white"
                    : "bg-white text-stone-600 border border-stone-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
}
