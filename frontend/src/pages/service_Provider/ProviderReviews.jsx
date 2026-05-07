import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const ProviderReviews = () => {
  const token = useSelector((state) => state.user.token);
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/task/provider/reviews",
        {
          withCredentials: true,
        }
      );

      setReviews(res.data.reviews);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl text-white mb-6 px-12 mt-10">⭐ Customer Reviews</h1>

      {reviews.length === 0 ? (
        <p className="text-white/60 px-12">No reviews yet</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 px-12 mt-5">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-[#11112a] border border-white/10 p-5 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={r.userId?.url || "/Profile_Image.jpg"}
                  className="w-10 h-10 rounded-full"
                />
                <p className="text-white font-semibold">
                  {r.userId?.name}
                </p>
              </div>

              <p className="text-yellow-400 mb-2">
                {"★".repeat(r.rating)}
              </p>

              <p className="text-white/70 text-sm">
                {r.feedback || "No feedback given"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderReviews;