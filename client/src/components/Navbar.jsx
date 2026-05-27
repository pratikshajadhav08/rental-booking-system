import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";

const guestLinks = [
  { to: "/listings", label: "Listings" },
];

const userLinks = [
  { to: "/listings", label: "Listings" },
  { to: "/favorites", label: "Favorites" },
  { to: "/bookings", label: "My Bookings" },
];

const hostLinks = [
  { to: "/host/dashboard", label: "Dashboard" },
  { to: "/host/listings", label: "My Properties" },
  { to: "/host/bookings", label: "Bookings" },
  { to: "/host/add-property", label: "Add Property" },
];

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/listings", label: "Listings" },
  { to: "/admin/bookings", label: "Bookings" },
];

function AvatarInitials({ name, avatar }) {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={name || "Profile"}
        className="w-8 h-8 rounded-full object-cover bg-stone-100"
      />
    );
  }

  const initials =
    name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xs font-bold select-none">
      {initials}
    </div>
  );
}

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("userInfo") || "null");
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  const links = useMemo(() => {
    if (!user) return guestLinks;
    if (user.role === "admin") return adminLinks;
    if (user.role === "host") return hostLinks;
    return userLinks;
  }, [user]);

  const roleDashboard =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "host"
        ? "/host/dashboard"
        : "/";

  const roleLabel =
    user?.role === "admin" ? "Admin" : user?.role === "host" ? "Host" : "Guest";

  useEffect(() => {
    const handler = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header className="bg-white border-b border-stone-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link to={roleDashboard} className="flex items-center gap-2 shrink-0 group">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ background: "linear-gradient(135deg,#FF385C,#E31C5F)" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <span className="text-[20px] font-extrabold text-stone-900 tracking-tight">
            Stay<span style={{ color: "#FF385C" }}>Finder</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`relative px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${
                isActive(to)
                  ? "text-rose-500 bg-rose-50"
                  : "text-stone-500 hover:text-stone-900 hover:bg-stone-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {user && (
            <Link
              to="/profile"
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 rounded-2xl px-3 py-2 transition border border-stone-200"
            >
              <AvatarInitials name={user.name} avatar={user.avatar} />
              <span>{roleLabel}</span>
            </Link>
          )}

          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((open) => !open)}
                className={`flex items-center gap-2.5 border rounded-2xl px-3 py-2 transition-all ${
                  menuOpen
                    ? "border-stone-400 shadow-md bg-white"
                    : "border-stone-200 hover:shadow-sm hover:border-stone-300 bg-white"
                }`}
                aria-label="Open account menu"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <AvatarInitials name={user.name} avatar={user.avatar} />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white rounded-2xl border border-stone-100 py-2 z-50"
                  style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}
                >
                  <div className="px-4 py-3 border-b border-stone-100">
                    <p className="text-[13px] font-bold text-stone-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-stone-400 truncate mt-0.5">{user.email}</p>
                    <p className="text-[11px] font-bold text-rose-500 capitalize mt-1">{user.role}</p>
                  </div>

                  <div className="py-1">
                    {links.map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        className="flex items-center px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition font-medium"
                      >
                        {label}
                        {isActive(to) && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-500" />}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-stone-100 py-1 mt-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition font-medium"
                    >
                      Profile settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition font-semibold text-left"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-sm font-semibold text-stone-700 hover:text-stone-900 px-4 py-2 rounded-2xl hover:bg-stone-50 transition"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold text-white rounded-2xl px-4 py-2 transition active:scale-95"
                style={{ background: "linear-gradient(135deg,#FF385C,#E31C5F)" }}
              >
                Sign up
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen((open) => !open)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white px-6 py-4 space-y-1">
          {user && (
            <div className="flex items-center gap-3 pb-4 mb-2 border-b border-stone-100">
              <AvatarInitials name={user.name} avatar={user.avatar} />
              <div>
                <p className="text-sm font-bold text-stone-900">{user.name}</p>
                <p className="text-xs text-stone-400">{user.email}</p>
                <p className="text-xs font-bold text-rose-500 capitalize">{user.role}</p>
              </div>
            </div>
          )}

          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition ${
                isActive(to)
                  ? "bg-rose-50 text-rose-500"
                  : "text-stone-600 hover:bg-stone-50"
              }`}
            >
              {label}
              {isActive(to) && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                to="/profile"
                className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-semibold transition ${
                  isActive("/profile")
                    ? "bg-rose-50 text-rose-500"
                    : "text-stone-600 hover:bg-stone-50"
                }`}
              >
                Profile settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-3 text-sm font-semibold text-rose-500 hover:bg-rose-50 rounded-xl transition"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="flex-1 text-center text-sm font-bold border border-stone-200 py-2.5 rounded-xl text-stone-700 hover:bg-stone-50 transition">
                Log in
              </Link>
              <Link
                to="/register"
                className="flex-1 text-center text-sm font-bold py-2.5 rounded-xl text-white transition"
                style={{ background: "linear-gradient(135deg,#FF385C,#E31C5F)" }}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
