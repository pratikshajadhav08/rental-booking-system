import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "./AdminLayout";

const cards = [
  ["totalUsers", "Users"],
  ["totalHosts", "Hosts"],
  ["totalListings", "Listings"],
  ["pendingListings", "Pending"],
  ["activeBookings", "Active bookings"],
  ["revenue", "Revenue"],
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    api.get("/admin/dashboard").then((res) => setStats(res.data));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map(([key, label]) => (
          <div key={key} className="bg-white border border-stone-100 rounded-2xl p-5">
            <p className="text-sm font-semibold text-stone-400">{label}</p>
            <p className="text-3xl font-extrabold text-stone-900 mt-2">
              {key === "revenue"
                ? `₹${Number(stats[key] || 0).toLocaleString("en-IN")}`
                : stats[key] || 0}
            </p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
