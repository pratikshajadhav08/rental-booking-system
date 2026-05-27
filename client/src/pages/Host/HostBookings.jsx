import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";

const statuses = ["pending", "confirmed", "cancelled"];

export default function HostBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    const { data } = await api.get("/host/bookings");
    setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/bookings/${id}/status`, { status });
    fetchBookings();
  };

  return (
    <div className="min-h-screen" style={{ background: "#fafaf9" }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <p className="text-xs font-bold uppercase tracking-widest text-stone-400">Host</p>
        <h1 className="text-3xl font-extrabold text-stone-900 mb-6">Booking Requests</h1>

        <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden">
          {bookings.map((booking) => (
            <div key={booking._id} className="grid md:grid-cols-5 gap-3 p-4 border-b last:border-b-0">
              <div className="md:col-span-2">
                <p className="font-bold text-stone-900">{booking.listing?.title}</p>
                <p className="text-sm text-stone-400">{booking.user?.name} · {booking.user?.email}</p>
              </div>
              <p className="text-sm text-stone-600">
                {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
              </p>
              <p className="text-sm font-bold text-stone-900">
                Rs {Number(booking.totalPrice || 0).toLocaleString("en-IN")}
              </p>
              <select
                value={booking.status}
                onChange={(event) => updateStatus(booking._id, event.target.value)}
                className="border border-stone-200 rounded-xl px-3 py-2 text-sm capitalize"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
