import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { State, City } from "country-state-city";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import api from "../api/api"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// ✅ Address Schema
const addressSchema = z.object({
  houseNo: z.string().min(1, "House No required"),
  street: z.string().min(1, "Street required"),
  area: z.string().min(1, "Area required"),
  landmark: z.string().optional(),
  city: z.string().min(1, "City required"),
  state: z.string().min(1, "State required"),
  pincode: z
    .string()
    .length(6, "Pincode must be 6 digits")
    .regex(/^[1-9][0-9]{5}$/, "Invalid pincode"),
});

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const location = useLocation();

  const user = useSelector((state) => state.user.value);

  const [service, setService] = useState(null);
  const [addresses, setAddresses] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState("");
  const [serviceDate, setServiceDate] = useState("");

  // ✅ Preferred Time Slot (Only One String)
  const [preferredTime, setPreferredTime] = useState("");

  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  // ⭐ Modal State
  const [showModal, setShowModal] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [selectedStateName, setSelectedStateName] = useState("");

  const [addressLoading, setAddressLoading] = useState(false);

  const [reviews, setReviews] = useState([]);

  // ✅ Only 3 Slots
  const timeSlots = [
    { label: "Morning (9AM - 12PM)", value: "Morning (9AM - 12PM)" },
    { label: "Afternoon (12PM - 4PM)", value: "Afternoon (12PM - 4PM)" },
    { label: "Evening (4PM - 9PM)", value: "Evening (4PM - 9PM)" },
  ];

  // ✅ React Hook Form Setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    mode: "onTouched",
  });

  // Load States
  useEffect(() => {
    setStates(State.getStatesOfCountry("IN"));
  }, []);

  // Fetch service details
  const fetchServiceDetails = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        `/services/get-service/${id}`
      );

      setService(res.data.service);
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error("Failed to load service");
    } finally {
      setLoading(false);
    }
  };

  // Fetch addresses
  const fetchAddresses = async () => {
    if (!user) return;

    try {
      const res = await api.get("/address", {
        withCredentials: true,
      });

      setAddresses(res.data.addresses || []);
    } catch (err) {
      setAddresses([]);
    }
  };

  useEffect(() => {
    fetchServiceDetails();
    fetchAddresses();
    fetchReviews();
  }, [id, user]);

  // Get Location
  const getLocation = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            type: "Point",
            coordinates: [pos.coords.longitude, pos.coords.latitude],
          }),
        reject
      );
    });

  // Handle State Change
  const handleStateChange = (e) => {
    const stateCode = e.target.value;

    const selected = states.find((s) => s.isoCode === stateCode);

    setSelectedStateCode(stateCode);
    setSelectedStateName(selected?.name || "");

    const cityList = City.getCitiesOfState("IN", stateCode);
    setCities(cityList);

    setValue("state", selected?.name || "");
  };

  // Add Address Submit
  const onSubmitAddress = async (data) => {
    if (addressLoading) return;
    setAddressLoading(true);

    try {
      const location = await getLocation();

      const payload = {
        ...data,
        state: selectedStateName,
        location,
      };

      const res = await api.post("/address", payload, {
        withCredentials: true,
      });

      toast.success(res.data.message || "Address added successfully");

      setAddresses((prev) => [...prev, res.data.address]);
      setSelectedAddress(res.data.address._id);

      reset();
      setShowModal(false);
      setCities([]);
      setSelectedStateCode("");
      setSelectedStateName("");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Address add failed");
    } finally {
      setAddressLoading(false);
    }
  };

  // Book service
  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login first to book service");
      navigate("/login");
      return;
    }

    if (!selectedAddress) return toast.error("Please select address");
    if (!serviceDate) return toast.error("Please select service date");
    if (!preferredTime) return toast.error("Please select preferred time slot");

    try {
      setBookingLoading(true);

      const payload = {
        serviceId: id,
        addressId: selectedAddress,
        serviceDate,
        preferredTime,
      };

      const res = await api.post("/task", payload, {
        withCredentials: true,
      });

      toast.success(res.data.message || "Booked successfully");
      navigate("/my-bookings");
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  // Today Date (disable past booking)
  const today = new Date().toISOString().split("T")[0];

  const fetchReviews = async () => {
    try {
      const res = await api.get(
        `/service/${id}/reviews`
      );

      setReviews(res.data.reviews || []);
    } catch (err) {
      setReviews([]);
    }
  };

  const avgRating =
  reviews.length > 0
    ? (
        reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
        reviews.length
      )
    : 0;

const avgRatingDisplay = avgRating.toFixed(1);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading service...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Service not found.
      </div>
    );
  }

  return (
    <section className="min-h-screen py-8 px-6 bg-[#010314]">
      <div className="max-w-7xl mx-auto">
        <Link to="/services" className="text-highlight text-sm hover:underline flex items-center gap-2 mb-6">
          ← Back to Services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT COLUMN: Images, Details, Reviews */}
          <div className="lg:col-span-2 space-y-8">

            {/* Title & Description */}
            <div>
              <h1 className="text-4xl font-extrabold text-white mb-3">{service.name}</h1>
              <p className="text-gray-400 text-base leading-relaxed">{service.description}</p>
            </div>

            {/* Images */}
            <div className="bg-[#12121f] border border-white/10 rounded-2xl p-4 shadow-xl">
              {service.images?.length > 0 ? (
                <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scroll-smooth custom-scroll pb-2">
                  {service.images.map((img, index) => (
                    <img
                      key={index}
                      src={img.url}
                      alt="service"
                      className="w-full md:w-4/5 h-80 object-cover rounded-xl flex-shrink-0 snap-center border border-white/5"
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full h-64 flex items-center justify-center text-gray-500 bg-black/20 rounded-xl">
                  No Images Available
                </div>
              )}
            </div>

            {/* Provider Details */}
            <div className="bg-[#12121f] border border-white/10 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Service Provider</h3>
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-highlight shadow-lg shadow-highlight/20">
                  <img
                    src={service.providerId?.image?.url || "/Profile_Image.jpg"}
                    alt="provider"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">
                    {service.providerId?.name || "Unknown Provider"}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {service.providerId?.email || "No email available"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-yellow-400 text-sm">
                      {"★".repeat(Math.round(avgRating))}
                      {"☆".repeat(5 - Math.round(avgRating))}
                    </div>
                    <span className="text-gray-400 text-xs">
                      ({avgRating} • {reviews.length} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-[#12121f] border border-white/10 rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-2">
                Customer Reviews
              </h2>

              {reviews.length === 0 ? (
                <p className="text-gray-400 italic">No reviews yet. Be the first to review after booking!</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {reviews.map((r) => (
                    <div
                      key={r._id}
                      className="bg-black/20 border border-white/5 p-4 rounded-xl hover:border-white/10 transition-all"
                    >
                      <p className="text-white font-semibold">{r.userId?.name || "User"}</p>
                      <p className="text-yellow-400 text-sm my-1">{"★".repeat(r.rating)}</p>
                      <p className="text-gray-400 text-sm">{r.feedback || "No written feedback provided."}</p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-[rgba(20,22,35,0.7)] backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-2">Book Service</h2>

              <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-white/10">
                <span className="text-3xl font-extrabold text-green-400">₹{service.price}</span>
                <span className="text-gray-400">/ session</span>
              </div>

              {/* Address Selection */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-gray-300">Service Location</label>
                  <button
                    onClick={() => {
                      if (!user) {
                        toast.error("Please login first to add address");
                        navigate("/login");
                        return;
                      }
                      setShowModal(true);
                    }}
                    className="text-highlight text-xs font-bold hover:text-primary transition-colors"
                  >
                    + ADD NEW
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-sm text-gray-500 p-3 bg-black/20 rounded-xl border border-white/5 text-center">
                    No addresses found. Add one above.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scroll pr-2">
                    {addresses.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => setSelectedAddress(addr._id)}
                        className={`cursor-pointer p-3 rounded-xl border transition-all ${selectedAddress === addr._id
                            ? 'border-highlight bg-highlight/10'
                            : 'border-white/10 bg-black/40 hover:border-white/30'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full border border-white/50 flex items-center justify-center ${selectedAddress === addr._id ? 'border-highlight' : ''}`}>
                            {selectedAddress === addr._id && <div className="w-1.5 h-1.5 bg-highlight rounded-full"></div>}
                          </div>
                          <p className="text-sm text-white font-medium line-clamp-1">
                            {addr.houseNo}, {addr.area}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 ml-5 mt-1 line-clamp-1">{addr.city} - {addr.pincode}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Selection */}
              <div className="mb-5">
                <label className="text-sm font-semibold text-gray-300 block mb-2">Select Date</label>
                <input
                  type="date"
                  min={today}
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-sm text-white outline-none focus:border-highlight transition-all cursor-pointer"
                />
              </div>

              {/* Time Slot Selection */}
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-300 block mb-2">Preferred Time</label>
                <div className="grid grid-cols-1 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.value}
                      onClick={() => setPreferredTime(slot.value)}
                      className={`text-sm py-2.5 px-3 rounded-xl border transition-all text-left ${preferredTime === slot.value
                          ? "bg-highlight/20 border-highlight text-highlight font-bold"
                          : "bg-black/40 border-white/10 text-gray-300 hover:border-white/30 hover:bg-white/5"
                        }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="w-full bg-highlight hover:bg-primary text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-highlight/20 transition-all hover:shadow-highlight/40 disabled:opacity-50 disabled:shadow-none"
              >
                {bookingLoading ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Address Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-[#0d0d1a] p-6 rounded-2xl w-full max-w-lg border border-white/10 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-highlight border-b border-white/10 pb-3">
              Add New Address
            </h2>

            <form onSubmit={handleSubmit(onSubmitAddress)} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {["houseNo", "street", "area", "pincode"].map((field) => (
                  <div key={field} className="flex flex-col gap-1">
                    <input
                      {...register(field)}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      className={`w-full border ${errors[field] ? "border-red-400" : "border-white/10"} bg-black/40 rounded-xl py-2 px-3 outline-none text-sm focus:border-highlight transition-colors`}
                    />
                  </div>
                ))}
              </div>

              <textarea
                {...register("landmark")}
                placeholder="Landmark (Optional)"
                className="w-full p-3 border border-white/10 rounded-xl bg-black/40 text-sm outline-none focus:border-highlight transition-colors resize-none"
                rows="2"
              />

              <div className="grid grid-cols-2 gap-3">
                {/* State */}
                <select
                  value={selectedStateCode}
                  onChange={handleStateChange}
                  className="w-full border border-white/10 bg-black/40 rounded-xl py-2 px-3 text-white appearance-none text-sm outline-none focus:border-highlight transition-colors cursor-pointer"
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.isoCode} value={s.isoCode}>
                      {s.name}
                    </option>
                  ))}
                </select>

                {/* City */}
                <select
                  {...register("city")}
                  disabled={!selectedStateCode}
                  className="w-full border border-white/10 bg-black/40 rounded-xl py-2 px-3 text-white appearance-none disabled:opacity-50 text-sm outline-none focus:border-highlight transition-colors cursor-pointer"
                >
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 bg-transparent border border-white/20 hover:bg-white/5 rounded-xl text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addressLoading}
                  className="px-5 py-2 bg-highlight hover:bg-primary rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                >
                  {addressLoading ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServiceDetails;