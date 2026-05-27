import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div className="min-h-screen" style={{ background: "#fafaf9" }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-14">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
          About us
        </p>
        <h1 className="text-4xl font-extrabold text-stone-900 mt-2">
          Making rentals simpler for guests, hosts, and admins.
        </h1>
        <p className="text-stone-500 leading-relaxed mt-5 max-w-3xl">
          StayFinder is a full-stack rental booking platform inspired by modern
          marketplace products. Guests can discover stays and book trips, hosts
          can publish and manage properties, and admins can keep the platform
          organized with approval and reporting tools.
        </p>

        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {[
            ["Guests", "Search stays, save favorites, book trips, and manage payments."],
            ["Hosts", "Create listings, track bookings, and manage rental earnings."],
            ["Admins", "Review listings, manage users, and monitor platform activity."],
          ].map(([title, text]) => (
            <div key={title} className="bg-white border border-stone-100 rounded-2xl p-5">
              <h2 className="font-extrabold text-stone-900">{title}</h2>
              <p className="text-sm text-stone-500 mt-2 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
