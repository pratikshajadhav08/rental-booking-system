import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "#fafaf9" }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-14">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
          Contact
        </p>
        <h1 className="text-4xl font-extrabold text-stone-900 mt-2">
          How can we help?
        </h1>
        <p className="text-stone-500 leading-relaxed mt-4 max-w-2xl">
          Reach out for booking help, hosting support, listing approvals, or
          general platform questions.
        </p>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6 mt-10">
          <section className="bg-white border border-stone-100 rounded-2xl p-6">
            <h2 className="font-extrabold text-stone-900 mb-4">Support details</h2>
            <div className="grid gap-4 text-sm">
              <p><span className="font-bold text-stone-700">Email:</span> support@stayfinder.com</p>
              <p><span className="font-bold text-stone-700">Phone:</span> +91 99999 99999</p>
              <p><span className="font-bold text-stone-700">Hours:</span> 9 AM - 8 PM, Monday to Saturday</p>
              <p><span className="font-bold text-stone-700">Office:</span> Mumbai, India</p>
            </div>
          </section>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
            className="bg-white border border-stone-100 rounded-2xl p-6"
          >
            <div className="grid gap-4">
              <input className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-stone-400" placeholder="Your name" required />
              <input className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-stone-400" placeholder="Email address" type="email" required />
              <select className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-stone-400">
                <option>Booking support</option>
                <option>Host support</option>
                <option>Admin/listing review</option>
                <option>Other</option>
              </select>
              <textarea className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none focus:border-stone-400 min-h-32 resize-none" placeholder="Message" required />
            </div>
            {sent && <p className="text-sm font-semibold text-emerald-600 mt-4">Message received. We will contact you soon.</p>}
            <button className="mt-5 text-sm font-bold text-white rounded-2xl px-6 py-3" style={{ background: "linear-gradient(135deg,#FF385C,#E31C5F)" }}>
              Send message
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
