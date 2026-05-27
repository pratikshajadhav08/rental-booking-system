import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";

const statusStyle = {
  confirmed: "bg-emerald-50 text-emerald-600",
  pending: "bg-amber-50 text-amber-600",
  cancelled: "bg-rose-50 text-rose-600",
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/bookings/my");
      setBookings(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (id) => {
    if (!confirm("Cancel this booking?")) return;
    await api.put(`/bookings/${id}/cancel`);
    fetchBookings();
  };

  return (
    <div className="min-h-screen" style={{ background: "#fafaf9" }}>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
            Trips
          </p>
          <h1 className="text-3xl font-extrabold text-stone-900">My Bookings</h1>
        </div>

        {loading && <p className="text-stone-400">Loading bookings...</p>}

        {!loading && bookings.length === 0 && (
          <div className="bg-white border border-stone-100 rounded-2xl p-12 text-center">
            <h2 className="text-xl font-bold text-stone-800">No trips booked yet</h2>
            <p className="text-sm text-stone-400 mt-2">
              Browse listings, select dates, and complete checkout to see trips here.
            </p>
          </div>
        )}

        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl border border-stone-100 overflow-hidden grid md:grid-cols-4"
            >
              <img
                src={booking.listing?.image}
                alt={booking.listing?.title}
                className="h-60 w-full object-cover bg-stone-100"
              />

              <div className="p-5 md:col-span-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-stone-900">
                      {booking.listing?.title}
                    </h2>
                    <p className="text-stone-500">{booking.listing?.location}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                      statusStyle[booking.status] || statusStyle.pending
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-sm mt-5">
                  <p>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
                  <p>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
                  <p>Guests: {booking.guests}</p>
                  <p className="capitalize">Payment: {booking.paymentMethod?.replaceAll("_", " ")}</p>
                  <p className="capitalize">Payment status: {booking.paymentStatus}</p>
                  {booking.cardLast4 && <p>Card: ending {booking.cardLast4}</p>}
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-stone-100">
                  <p className="font-extrabold text-xl text-stone-900">
                    Rs {Number(booking.totalPrice || 0).toLocaleString("en-IN")}
                  </p>
                  {booking.status !== "cancelled" && (
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      className="text-sm font-bold text-rose-500 hover:text-rose-600"
                    >
                      Cancel booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
