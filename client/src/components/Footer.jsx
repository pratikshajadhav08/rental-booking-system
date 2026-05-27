import { Link } from "react-router-dom";

const companyLinks = [
  { to: "/listings", label: "Explore stays" },
  { to: "/about", label: "About us" },
  { to: "/contact", label: "Contact" },
  { to: "/favorites", label: "Saved stays" },
  { to: "/bookings", label: "Trips" },
];

const hostLinks = [
  { to: "/host/dashboard", label: "Host dashboard" },
  { to: "/host/add-property", label: "List your place" },
  { to: "/host/bookings", label: "Host bookings" },
];

const supportLinks = [
  { to: "/profile", label: "Account" },
  { to: "/login", label: "Log in" },
  { to: "/register", label: "Sign up" },
];

function FooterColumn({ title, links }) {
  return (
    <div>
      <h3 className="text-sm font-extrabold text-stone-900 mb-3">{title}</h3>
      <div className="grid gap-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-sm text-stone-500 hover:text-rose-500 transition"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#FF385C,#E31C5F)" }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-stone-900">
                Stay<span style={{ color: "#FF385C" }}>Finder</span>
              </span>
            </Link>
            <p className="text-sm text-stone-500 leading-relaxed mt-4 max-w-sm">
              Book unique stays, manage hosting, and run rental operations from one full-stack rental booking platform.
            </p>
          </div>

          <FooterColumn title="Travel" links={companyLinks} />
          <FooterColumn title="Hosting" links={hostLinks} />
          <FooterColumn title="Support" links={supportLinks} />
        </div>

        <div className="mt-10 pt-6 border-t border-stone-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <p className="text-xs text-stone-400">
            © {new Date().getFullYear()} StayFinder. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-stone-400">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Trust & safety</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
