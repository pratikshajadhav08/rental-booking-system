import { useEffect, useState } from "react";
import api from "../../api/axios";
import AdminLayout from "./AdminLayout";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get("/admin/reviews").then((res) => setReviews(res.data));
  }, []);

  return (
    <AdminLayout title="Reviews">
      <div className="grid gap-3">
        {reviews.length === 0 && (
          <div className="bg-white border border-stone-100 rounded-2xl p-10 text-center text-stone-400">
            No reviews yet.
          </div>
        )}
        {reviews.map((review) => (
          <div key={review._id} className="bg-white border border-stone-100 rounded-2xl p-4">
            <p className="font-bold text-stone-900">{review.listing?.title || "Listing"}</p>
            <p className="text-sm text-stone-500">{review.user?.name || "User"} · {review.rating}/5</p>
            <p className="text-sm text-stone-700 mt-2">{review.comment}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
