import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, CreditCard, Star } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const Order_Card = ({ order, onReviewSubmitted }) => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) return null;

  const handleSubmitReview = async () => {
    if (!rating) return toast.error("Please provide a rating");

    setIsSubmitting(true);
    try {
      const res = await axios.patch(
        `http://localhost:8000/api/task/${order._id}/review`,
        { rating, feedback },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Review submitted successfully");
      setShowReviewModal(false);
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-w-[18rem] border border-blur-[14px] rounded-2xl p-5 bg-[rgba(20,22,35,0.55)] border-white/10 shadow-md hover:border-purple-500/40 transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <p className="font-bold text-white text-lg truncate w-3/4" title={order.serviceId?.name}>
            {order.serviceId?.name || "Service"}
          </p>
          <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
            order.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
            order.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
            'bg-purple-500/20 text-purple-300'
          }`}>
            {order.status}
          </span>
        </div>
        
        <p className="text-xs text-gray-400 mb-4 line-clamp-1">
          Provider: {order.providerId?.name || "N/A"}
        </p>

        <div className="flex flex-col gap-2 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-highlight" />
            <span>{new Date(order.serviceDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-highlight" />
            <span>{order.preferredTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard size={14} className="text-highlight" />
            <span className="font-semibold text-green-400">&#8377;{order.price}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
        {order.status === 'COMPLETED' && !order.feedback && (
          <button 
            onClick={() => setShowReviewModal(true)}
            className="w-full text-center text-sm font-semibold text-highlight border border-highlight/50 hover:bg-highlight hover:text-white py-2 rounded-lg transition-all"
          >
            Leave Review
          </button>
        )}
        <Link to={`/service/${order.serviceId?._id || order.serviceId}`} state={{ taskId: order._id, status: order.status }} className="block text-center text-sm font-semibold text-white bg-highlight/80 hover:bg-highlight py-2 rounded-lg transition-all">
          View Details
        </Link>
      </div>

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[100] px-4">
          <div className="bg-[#0d0d1a] p-6 rounded-2xl w-full max-w-sm border border-white/10 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Rate Provider</h3>
            
            <div className="flex gap-2 justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-transform hover:scale-110 ${
                    star <= rating ? "text-yellow-400" : "text-white/20 hover:text-yellow-400/50"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              placeholder="Leave some feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white mb-4 outline-none focus:border-highlight resize-none h-24"
            />

            <div className="flex gap-3">
              <button 
                onClick={() => setShowReviewModal(false)}
                className="flex-1 py-2 rounded-xl text-sm font-semibold bg-transparent border border-white/20 hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="flex-1 py-2 rounded-xl text-sm font-bold bg-highlight hover:bg-primary text-white transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order_Card;
