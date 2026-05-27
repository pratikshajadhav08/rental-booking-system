import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { getDashboardPath } from "../utils/roleRedirect";

const inputClass =
  "w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-400 focus:bg-white";

export default function Profile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    phone: "",
    avatar: "",
    address: "",
    bio: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        setForm((current) => ({ ...current, ...data, password: "" }));
      } catch (error) {
        setMessage(error.response?.data?.message || "Could not load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const initials = useMemo(
    () =>
      form.name
        ?.split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U",
    [form.name],
  );

  const shortcuts = {
    user: [
      { label: "My bookings", to: "/bookings" },
      { label: "Saved stays", to: "/favorites" },
      { label: "Explore listings", to: "/listings" },
    ],
    host: [
      { label: "Host dashboard", to: "/host/dashboard" },
      { label: "My listings", to: "/host/listings" },
      { label: "Booking requests", to: "/host/bookings" },
    ],
    admin: [
      { label: "Admin dashboard", to: "/admin/dashboard" },
      { label: "Manage users", to: "/admin/users" },
      { label: "Approve listings", to: "/admin/listings" },
    ],
  };

  const set = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        avatar: form.avatar,
        address: form.address,
        bio: form.bio,
      };

      if (form.password.trim()) {
        payload.password = form.password;
      }

      const { data } = await api.put("/auth/profile", payload);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setForm((current) => ({ ...current, ...data, password: "" }));
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#fafaf9" }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
            Account
          </p>
          <h1 className="text-3xl font-extrabold text-stone-900">Profile</h1>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-stone-100 p-8 text-stone-400">
            Loading profile...
          </div>
        ) : (
          <div className="grid lg:grid-cols-[320px_1fr] gap-6">
            <aside className="bg-white rounded-2xl border border-stone-100 p-6 self-start">
              <div className="flex flex-col items-center text-center">
                {form.avatar ? (
                  <img
                    src={form.avatar}
                    alt={form.name}
                    className="w-24 h-24 rounded-full object-cover bg-stone-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-3xl font-extrabold">
                    {initials}
                  </div>
                )}
                <h2 className="text-xl font-extrabold text-stone-900 mt-4">
                  {form.name}
                </h2>
                <p className="text-sm text-stone-400">{form.email}</p>
                <span className="mt-3 text-xs font-bold capitalize bg-stone-100 text-stone-600 px-3 py-1 rounded-full">
                  {form.role}
                </span>
              </div>

              <div className="mt-6 grid gap-2">
                <Link
                  to={getDashboardPath(form.role)}
                  className="text-sm font-bold text-white rounded-xl px-4 py-3 text-center"
                  style={{ background: "linear-gradient(135deg,#FF385C,#E31C5F)" }}
                >
                  Go to dashboard
                </Link>
                {(shortcuts[form.role] || shortcuts.user).map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="text-sm font-semibold text-stone-600 border border-stone-200 rounded-xl px-4 py-3 hover:bg-stone-50"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </aside>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl border border-stone-100 p-6"
            >
              <div className="grid md:grid-cols-2 gap-5">
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-stone-600">Full name</span>
                  <input className={inputClass} value={form.name} onChange={set("name")} />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-stone-600">Email</span>
                  <input className={inputClass} value={form.email} disabled />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-stone-600">Phone</span>
                  <input className={inputClass} value={form.phone} onChange={set("phone")} />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-stone-600">Avatar URL</span>
                  <input className={inputClass} value={form.avatar} onChange={set("avatar")} />
                </label>
                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-bold text-stone-600">Address</span>
                  <input className={inputClass} value={form.address} onChange={set("address")} />
                </label>
                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-bold text-stone-600">Bio</span>
                  <textarea
                    className={`${inputClass} min-h-28 resize-none`}
                    value={form.bio}
                    onChange={set("bio")}
                    placeholder="Tell guests or hosts a little about you."
                  />
                </label>
                <label className="grid gap-2 md:col-span-2">
                  <span className="text-sm font-bold text-stone-600">New password</span>
                  <input
                    type="password"
                    className={inputClass}
                    value={form.password}
                    onChange={set("password")}
                    placeholder="Leave blank to keep current password"
                  />
                </label>
              </div>

              {message && (
                <p className="mt-5 text-sm font-semibold text-stone-600">{message}</p>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="text-sm font-bold text-white rounded-2xl px-6 py-3 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg,#FF385C,#E31C5F)" }}
                >
                  {saving ? "Saving..." : "Save profile"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
