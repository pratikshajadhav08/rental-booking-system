import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "./AdminLayout";

const statuses = ["pending", "approved", "rejected"];

export default function Listings() {
  const [listings, setListings] = useState([]);

  const fetchListings = async () => {
    const { data } = await api.get("/admin/listings");
    setListings(data);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/admin/listings/${id}/status`, { status });
    fetchListings();
  };

  return (
    <AdminLayout title="Listings">
      <div className="grid gap-4">
        {listings.map((listing) => (
          <div key={listing._id} className="bg-white border border-stone-100 rounded-2xl p-4 grid md:grid-cols-[120px_1fr_auto] gap-4">
            <img src={listing.image} alt={listing.title} className="w-full h-24 object-cover rounded-xl bg-stone-100" />
            <div>
              <p className="font-bold text-stone-900">{listing.title}</p>
              <p className="text-sm text-stone-500">{listing.location} · {listing.host?.name || "Host"}</p>
              <p className="text-sm font-semibold text-stone-700 mt-2">Rs {Number(listing.price || 0).toLocaleString("en-IN")} / night</p>
            </div>
            <select
              value={listing.status}
              onChange={(event) => updateStatus(listing._id, event.target.value)}
              className="self-start border border-stone-200 rounded-xl px-3 py-2 text-sm capitalize"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
