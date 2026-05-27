import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";

export default function HostListings() {
  const [listings, setListings] = useState([]);

  const fetchListings = async () => {
    const { data } = await api.get("/host/properties");
    setListings(data);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const deleteListing = async (id) => {
    if (!confirm("Delete this listing?")) return;
    await api.delete(`/listings/${id}`);
    fetchListings();
  };

  return (
    <div className="min-h-screen" style={{ background: "#fafaf9" }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Host</p>
            <h1 className="text-3xl font-extrabold text-stone-900">My Listings</h1>
          </div>
          <Link to="/host/add-property" className="bg-stone-900 text-white rounded-2xl px-4 py-2 text-sm font-bold">
            Add property
          </Link>
        </div>

        <div className="grid gap-4">
          {listings.map((listing) => (
            <div key={listing._id} className="bg-white border border-stone-100 rounded-2xl p-4 grid md:grid-cols-[140px_1fr_auto] gap-4">
              <img src={listing.image} alt={listing.title} className="w-full h-28 object-cover rounded-xl bg-stone-100" />
              <div>
                <p className="font-bold text-stone-900">{listing.title}</p>
                <p className="text-sm text-stone-500">{listing.location} · {listing.maxGuests} guests</p>
                <p className="text-sm text-stone-500 mt-1">Status: <span className="font-bold capitalize">{listing.status}</span></p>
                <p className="text-sm font-bold text-stone-900 mt-2">Rs {Number(listing.price || 0).toLocaleString("en-IN")} / night</p>
              </div>
              <button onClick={() => deleteListing(listing._id)} className="self-start text-sm font-bold text-rose-500">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
