import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const MyBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:8000/api/task/user", {
        withCredentials: true, // ✅ IMPORTANT
      });

      setBookings(res.data.tasks || []);
    } catch (error) {
      console.log(error.response?.data || error.message);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking (delete from DB)
  const cancelBooking = async (taskId) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/task/cancel/${taskId}`,
        {
          withCredentials: true,
        },
      );

      toast.success(res.data.message || "Booking cancelled");

      // ✅ Remove booking from UI list
      setBookings((prev) => prev.filter((b) => b._id !== taskId));
    } catch (error) {
      console.log(error.response?.data || error.message);

      if (error.response?.status === 401) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      toast.error(error.response?.data?.message || "Cancel failed");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Bookings</h1>
            <p className="text-gray-400 text-sm mt-1">
              Track your service bookings and status
            </p>
          </div>

          <Link
            to="/services"
            className="bg-highlight px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition"
          >
            Book New Service
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-400 mt-20">
            Loading bookings...
          </div>
        )}

        {/* No bookings */}
        {!loading && bookings.length === 0 && (
          <div className="text-center mt-20">
            <p className="text-gray-400">No bookings found.</p>
            <Link
              to="/services"
              className="inline-block mt-4 text-highlight hover:underline"
            >
              Book your first service →
            </Link>
          </div>
        )}

        {/* Booking Cards */}
        {!loading && bookings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl p-6 shadow-lg"
              >
                {/* Service */}
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/30 border border-white/10">
                    <img
                      src={
                        booking.serviceId?.images?.[0]?.url ||
                        "/default-service.jpg"
                      }
                      alt="service"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-white">
                      {booking.serviceId?.name || "Service"}
                    </h2>

                    <p className="text-gray-400 text-sm mt-1">
                      ₹{booking.serviceId?.price || "N/A"} / visit
                    </p>

                    {/* Status Badge */}
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        booking.status === "PENDING"
                          ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          : booking.status === "CONFIRMED"
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : booking.status === "COMPLETED"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}
                    >
                      {booking.status || "PENDING"}
                    </span>
                  </div>
                </div>

                {/* Provider */}
                <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                    <img
                      src={
                        booking.providerId?.image?.url || "/Profile_Image.jpg"
                      }
                      alt="provider"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Provider</p>
                    <p className="text-sm font-semibold text-white">
                      {booking.providerId?.name || "Unknown Provider"}
                    </p>
                  </div>
                </div>

                {/* Booking Info */}
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-black/30 border border-white/10 rounded-xl p-3">
                    <p className="text-gray-400 text-xs">Service Date</p>
                    <p className="text-white font-semibold mt-1">
                      {formatDate(booking.serviceDate)}
                    </p>
                  </div>

                  <div className="bg-black/30 border border-white/10 rounded-xl p-3">
                    <p className="text-gray-400 text-xs">Time Slot</p>
                    <p className="text-white font-semibold mt-1">
                      {booking.preferredTime?.length > 0
                        ? booking.preferredTime
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Address */}
                <div className="mt-4 bg-black/30 border border-white/10 rounded-xl p-3">
                  <p className="text-gray-400 text-xs">Address</p>
                  <p className="text-white text-sm mt-1">
                    {booking.addressId?.houseNo}, {booking.addressId?.street},{" "}
                    {booking.addressId?.area}, {booking.addressId?.city} -{" "}
                    {booking.addressId?.pincode}
                  </p>
                </div>

                {/* Buttons */}
                <div className="mt-5 flex gap-3">
                  <Link
                    to={`/service/${booking.serviceId?._id}`}
                    className="flex-1 text-center py-2 rounded-xl text-sm font-semibold border border-highlight text-highlight hover:bg-highlight/10 transition"
                  >
                    View Service
                  </Link>

                  {booking.status !== "CANCELLED" &&
                    booking.status !== "COMPLETED" && (
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="flex-1 py-2 rounded-xl text-sm font-semibold bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 transition"
                      >
                        Cancel
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyBookings;
