import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import {
  Home, MapPin, IndianRupee, Image, Users,
  Tag, Wifi, Car, Wind, Utensils, Waves,
  WashingMachine, Tv, Dumbbell, CheckCircle2,
  ChevronRight, Loader2,
} from "lucide-react";

// ─── constants ──────────────────────────────────────────────
const CATEGORIES = [
  { id: "beach",    label: "Beachfront", icon: "🏖️" },
  { id: "mountain", label: "Mountains",  icon: "⛰️" },
  { id: "city",     label: "City",       icon: "🏙️" },
  { id: "heritage", label: "Heritage",   icon: "🏰" },
  { id: "villa",    label: "Villas",     icon: "🏡" },
  { id: "cabin",    label: "Cabins",     icon: "🪵" },
  { id: "farm",     label: "Farms",      icon: "🌾" },
  { id: "other",    label: "Other",      icon: "🏠" },
];

const AMENITIES = [
  { id: "wifi",    label: "Free WiFi",       icon: Wifi },
  { id: "parking", label: "Parking",         icon: Car },
  { id: "ac",      label: "Air Conditioning",icon: Wind },
  { id: "kitchen", label: "Kitchen",         icon: Utensils },
  { id: "pool",    label: "Pool",            icon: Waves },
  { id: "washer",  label: "Washer/Dryer",    icon: WashingMachine },
  { id: "tv",      label: "TV",              icon: Tv },
  { id: "gym",     label: "Gym",             icon: Dumbbell },
];

const STEPS = ["Basic Info", "Details", "Amenities", "Preview"];

// ─── helpers ────────────────────────────────────────────────
const Field = ({ label, icon: Icon, error, children }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-[13px] font-bold text-stone-600 flex items-center gap-1.5">
        {Icon && <Icon size={13} className="text-stone-400" />}
        {label}
      </label>
    )}
    {children}
    {error && <p className="text-[12px] text-rose-500 font-medium">{error}</p>}
  </div>
);

const inputCls = (err) =>
  `w-full rounded-2xl border px-4 py-3 text-sm text-stone-800 placeholder-stone-300 outline-none transition-all ${
    err
      ? "border-rose-300 bg-rose-50 focus:border-rose-400"
      : "border-stone-200 bg-stone-50 focus:border-stone-400 focus:bg-white"
  }`;

// ─── component ──────────────────────────────────────────────
export default function AddProperty() {
  const navigate = useNavigate();

  const [step,    setStep]    = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors,  setErrors]  = useState({});

  const [form, setForm] = useState({
    title: "", description: "", location: "",
    price: "", image: "", maxGuests: "",
    category: "", bedrooms: "", bathrooms: "",
    amenities: [],
  });

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleAmenity = (id) =>
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(id)
        ? f.amenities.filter((a) => a !== id)
        : [...f.amenities, id],
    }));

  // Per-step validation
  const validate = useCallback((s) => {
    const errs = {};
    if (s === 0) {
      if (!form.title.trim())       errs.title    = "Title is required";
      if (!form.description.trim()) errs.description = "Description is required";
      if (!form.category)           errs.category = "Pick a category";
    }
    if (s === 1) {
      if (!form.location.trim()) errs.location = "Location is required";
      if (!form.price || isNaN(+form.price) || +form.price <= 0)
        errs.price = "Enter a valid price";
      if (!form.maxGuests || isNaN(+form.maxGuests) || +form.maxGuests < 1)
        errs.maxGuests = "Enter valid guest count";
      if (form.image && !/^https?:\/\//.test(form.image))
        errs.image = "Must be a valid URL starting with http(s)://";
    }
    return errs;
  }, [form]);

  const next = () => {
    const errs = validate(step);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => { setErrors({}); setStep((s) => Math.max(s - 1, 0)); };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await api.post("/listings", form);
      setSuccess(true);
      setTimeout(() => navigate("/host/listings"), 2000);
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // ── SUCCESS SCREEN ──
  if (success) return (
    <div className="min-h-screen flex flex-col" style={{ background: "#fafaf9" }}>
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center gap-5 text-center px-6">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
          style={{ background: "linear-gradient(135deg,#f0fdf8,#d1fae5)" }}>
          ✅
        </div>
        <h2 className="text-2xl font-extrabold text-stone-900">Property listed!</h2>
        <p className="text-stone-400 text-sm max-w-xs">Your property is live. Redirecting to your listings…</p>
      </div>
    </div>
  );

  // ── MAIN ──
  return (
    <div className="min-h-screen" style={{ background: "#fafaf9" }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* ── PAGE HEADER ── */}
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">Host</p>
          <h1 className="text-[26px] font-extrabold text-stone-900">Add a Property</h1>
        </div>

        {/* ── STEP PROGRESS ── */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    i < step
                      ? "bg-emerald-500 text-white"
                      : i === step
                      ? "text-white"
                      : "bg-stone-100 text-stone-400"
                  }`}
                  style={i === step ? { background: "linear-gradient(135deg,#FF385C,#E31C5F)" } : {}}
                >
                  {i < step ? <CheckCircle2 size={14} /> : i + 1}
                </div>
                <span className={`text-[10px] font-bold whitespace-nowrap ${
                  i === step ? "text-stone-800" : "text-stone-400"
                }`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mb-4 rounded-full transition-colors ${
                  i < step ? "bg-emerald-400" : "bg-stone-200"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* ── FORM CARD ── */}
        <div className="bg-white rounded-3xl border border-stone-100 p-7 mb-5"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>

          {/* STEP 0 — Basic Info */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-[17px] font-bold text-stone-800 mb-1">Basic information</h2>

              <Field label="Title" icon={Home} error={errors.title}>
                <input
                  className={inputCls(errors.title)}
                  placeholder="e.g. Cliffside Ocean Villa, Goa"
                  value={form.title}
                  onChange={set("title")}
                />
              </Field>

              <Field label="Description" error={errors.description}>
                <textarea
                  className={`${inputCls(errors.description)} resize-none`}
                  rows={4}
                  placeholder="Describe what makes your place special…"
                  value={form.description}
                  onChange={set("description")}
                />
              </Field>

              <Field label="Category" icon={Tag} error={errors.category}>
                <div className="grid grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, category: cat.id }))}
                      className={`flex flex-col items-center gap-1.5 rounded-2xl py-3 px-2 border text-center transition-all ${
                        form.category === cat.id
                          ? "border-rose-400 bg-rose-50"
                          : "border-stone-200 bg-stone-50 hover:border-stone-300"
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      <span className={`text-[10px] font-bold ${
                        form.category === cat.id ? "text-rose-500" : "text-stone-500"
                      }`}>{cat.label}</span>
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="text-[12px] text-rose-500 font-medium mt-1">{errors.category}</p>
                )}
              </Field>
            </div>
          )}

          {/* STEP 1 — Details */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-[17px] font-bold text-stone-800 mb-1">Property details</h2>

              <Field label="Location" icon={MapPin} error={errors.location}>
                <input
                  className={inputCls(errors.location)}
                  placeholder="e.g. Calangute, Goa"
                  value={form.location}
                  onChange={set("location")}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Price per night (₹)" icon={IndianRupee} error={errors.price}>
                  <input
                    type="number"
                    min="0"
                    className={inputCls(errors.price)}
                    placeholder="5000"
                    value={form.price}
                    onChange={set("price")}
                  />
                </Field>
                <Field label="Max guests" icon={Users} error={errors.maxGuests}>
                  <input
                    type="number"
                    min="1"
                    className={inputCls(errors.maxGuests)}
                    placeholder="4"
                    value={form.maxGuests}
                    onChange={set("maxGuests")}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Bedrooms">
                  <input
                    type="number"
                    min="0"
                    className={inputCls(false)}
                    placeholder="2"
                    value={form.bedrooms}
                    onChange={set("bedrooms")}
                  />
                </Field>
                <Field label="Bathrooms">
                  <input
                    type="number"
                    min="0"
                    className={inputCls(false)}
                    placeholder="1"
                    value={form.bathrooms}
                    onChange={set("bathrooms")}
                  />
                </Field>
              </div>

              <Field label="Image URL" icon={Image} error={errors.image}>
                <input
                  className={inputCls(errors.image)}
                  placeholder="https://images.unsplash.com/…"
                  value={form.image}
                  onChange={set("image")}
                />
              </Field>

              {/* Image preview */}
              {form.image && /^https?:\/\//.test(form.image) && (
                <div className="rounded-2xl overflow-hidden aspect-video border border-stone-200">
                  <img
                    src={form.image}
                    alt="preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — Amenities */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-[17px] font-bold text-stone-800 mb-1">What do you offer?</h2>
              <p className="text-sm text-stone-400 -mt-3">Select all amenities available at your property.</p>

              <div className="grid grid-cols-2 gap-3">
                {AMENITIES.map(({ id, label, icon: Icon }) => {
                  const active = form.amenities.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleAmenity(id)}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 border text-left transition-all ${
                        active
                          ? "border-rose-400 bg-rose-50"
                          : "border-stone-200 bg-stone-50 hover:border-stone-300"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={active ? "text-rose-500" : "text-stone-400"}
                      />
                      <span className={`text-[13px] font-semibold ${
                        active ? "text-rose-600" : "text-stone-600"
                      }`}>{label}</span>
                      {active && (
                        <CheckCircle2 size={14} className="ml-auto text-rose-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              <p className="text-[12px] text-stone-400 text-center">
                {form.amenities.length} of {AMENITIES.length} selected
              </p>
            </div>
          )}

          {/* STEP 3 — Preview */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-[17px] font-bold text-stone-800 mb-1">Review your listing</h2>

              {/* Mini card preview */}
              <div className="rounded-2xl overflow-hidden border border-stone-200">
                {form.image ? (
                  <img src={form.image} alt="" className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-stone-100 flex items-center justify-center text-stone-300 text-4xl">🏠</div>
                )}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-stone-900 text-[15px]">{form.title || "Your listing title"}</p>
                    {form.category && (
                      <span className="text-[10px] font-bold bg-stone-100 text-stone-500 px-2 py-1 rounded-full capitalize">
                        {form.category}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-stone-400 flex items-center gap-1">
                    <MapPin size={11} /> {form.location || "Location"}
                  </p>
                  <p className="text-[13px] text-stone-500 line-clamp-2">{form.description}</p>
                  <div className="flex items-center gap-4 text-[12px] text-stone-500 pt-1">
                    {form.maxGuests && <span>👥 {form.maxGuests} guests</span>}
                    {form.bedrooms  && <span>🛏 {form.bedrooms} bed{+form.bedrooms !== 1 ? "s" : ""}</span>}
                    {form.bathrooms && <span>🚿 {form.bathrooms} bath{+form.bathrooms !== 1 ? "s" : ""}</span>}
                  </div>
                  {form.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {form.amenities.map((id) => {
                        const a = AMENITIES.find((x) => x.id === id);
                        const Icon = a?.icon;
                        return (
                          <span key={id} className="flex items-center gap-1 text-[11px] bg-stone-50 border border-stone-200 text-stone-500 px-2 py-1 rounded-full">
                            {Icon && <Icon size={10} />} {a?.label}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <div className="h-px bg-stone-100 my-1" />
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-stone-900">
                      {form.price ? `₹${Number(form.price).toLocaleString("en-IN")}` : "₹ —"}
                      <span className="text-[12px] text-stone-400 font-normal"> / night</span>
                    </span>
                  </div>
                </div>
              </div>

              {errors.submit && (
                <p className="text-sm text-rose-500 font-medium text-center">{errors.submit}</p>
              )}
            </div>
          )}
        </div>

        {/* ── NAV BUTTONS ── */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={back}
            className={`text-sm font-bold px-6 py-3 rounded-2xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition ${
              step === 0 ? "opacity-0 pointer-events-none" : ""
            }`}
          >
            ← Back
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="flex items-center gap-2 text-sm font-bold text-white rounded-2xl px-8 py-3 transition active:scale-95"
              style={{ background: "linear-gradient(135deg,#FF385C,#E31C5F)" }}
            >
              Continue <ChevronRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 text-sm font-bold text-white rounded-2xl px-8 py-3 transition active:scale-95 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg,#FF385C,#E31C5F)" }}
            >
              {loading ? <><Loader2 size={15} className="animate-spin" /> Publishing…</> : "Publish listing 🎉"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
