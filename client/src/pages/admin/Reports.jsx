import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "./AdminLayout";

export default function Reports() {
  const [reports, setReports] = useState({ bookingsByLocation: [] });

  useEffect(() => {
    api.get("/admin/reports").then((res) => setReports(res.data));
  }, []);

  return (
    <AdminLayout title="Reports">
      <div className="bg-white border border-stone-100 rounded-2xl p-5">
        <h2 className="font-bold text-stone-900 mb-4">Bookings by location</h2>
        <div className="grid gap-3">
          {reports.bookingsByLocation.map((row) => (
            <div key={row.location} className="flex items-center gap-4">
              <span className="w-36 text-sm font-semibold text-stone-600">{row.location}</span>
              <div className="flex-1 h-3 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500" style={{ width: `${Math.min(row.count * 20, 100)}%` }} />
              </div>
              <span className="text-sm font-bold text-stone-900">{row.count}</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
