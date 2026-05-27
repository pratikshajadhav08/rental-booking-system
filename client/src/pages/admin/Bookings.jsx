import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "./AdminLayout";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/admin/bookings").then((res) => setBookings(res.data));
  }, []);

  return (
    <AdminLayout title="Bookings">
      <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden">
        {bookings.map((booking) => (
          <div key={booking._id} className="grid md:grid-cols-5 gap-3 p-4 border-b last:border-b-0">
            <div className="md:col-span-2">
              <p className="font-bold text-stone-900">{booking.listing?.title}</p>
              <p className="text-sm text-stone-400">Host: {booking.listing?.host?.name || "Unknown"}</p>
            </div>
            <p className="text-sm text-stone-600">Guest: {booking.user?.name}</p>
            <p className="text-sm text-stone-600">
              {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
            </p>
            <p className="text-sm font-bold text-stone-900">
              Rs {Number(booking.totalPrice || 0).toLocaleString("en-IN")} · {booking.status}
            </p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
