import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/api";

const ProviderReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/task/provider/reviews",
        {
          withCredentials: true,
        }
      );

      setReviews(res.data.reviews || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen px-12 py-10">
      <h1 className="text-2xl text-white mb-6">⭐ Customer Reviews</h1>

      {/* Loading */}
      {loading && (
        <p className="text-white/60 text-sm">Loading reviews...</p>
      )}

      {/* Empty */}
      {!loading && reviews.length === 0 && (
        <div className="text-center mt-20">
          <p className="text-white/60 text-lg">No reviews yet</p>
          <p className="text-white/40 text-sm mt-2">
            Once customers complete a service and give feedback, it will appear
            here.
          </p>
        </div>
      )}

      {/* Reviews */}
      {!loading && reviews.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 mt-5">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-[#11112a] border border-white/10 p-5 rounded-xl hover:border-highlight transition-all duration-300"
            >
              {/* User Info */}
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={r.userId?.image?.url || "/Profile_Image.jpg"}
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div>
                  <p className="text-white font-semibold text-sm">
                    {r.userId?.name || "Unknown User"}
                  </p>

                  {/* Service Name */}
                  <p className="text-white/50 text-xs">
                    Service: {r.serviceId?.name || "Unknown Service"}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <p className="text-yellow-400 mb-2 text-sm">
                {"★".repeat(r.rating || 0)}
                {"☆".repeat(5 - (r.rating || 0))}
              </p>

              {/* Feedback */}
              <p className="text-white/70 text-sm leading-relaxed">
                {r.feedback || "No feedback given"}
              </p>

              {/* Date */}
              <p className="text-white/40 text-xs mt-4">
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderReviews;