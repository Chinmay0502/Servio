import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { State, City } from "country-state-city";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

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

      const res = await axios.get(
        `http://localhost:8000/api/services/get-service/${id}`
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
      const res = await axios.get("http://localhost:8000/api/address", {
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

      const res = await axios.post("http://localhost:8000/api/address", payload, {
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
        preferredTime, // ✅ only one string
      };

      const res = await axios.post("http://localhost:8000/api/task", payload, {
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
    <section className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <Link to="/services" className="text-highlight text-sm hover:underline">
          ← Back to Services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
          {/* Images */}
          <div className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl p-4">
            {service.images?.length > 0 ? (
              <div className="flex overflow-x-auto gap-3 snap-x snap-mandatory scroll-smooth no-scrollbar">
                {service.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.url}
                    alt="service"
                    className="w-full h-96 object-cover rounded-xl flex-shrink-0 snap-center"
                  />
                ))}
              </div>
            ) : (
              <div className="w-full h-96 flex items-center justify-center text-gray-500">
                No Images Available
              </div>
            )}
          </div>

          {/* Details + Booking */}
          <div className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl p-8">
            <h1 className="text-2xl font-bold mb-3">{service.name}</h1>

            <p className="text-gray-400 text-sm mb-5">{service.description}</p>

            <p className="text-white font-bold text-xl mb-6">
              ₹{service.price}{" "}
              <span className="text-gray-500 text-sm font-normal">/ visit</span>
            </p>

            {/* Provider Details */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-black/30 border border-white/10 mb-6">
              <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-white/10">
                <img
                  src={service.providerId?.image?.url || "/Profile_Image.jpg"}
                  alt="provider"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <p className="text-sm text-gray-400">Service Provider</p>

                <h3 className="text-white font-semibold text-base">
                  {service.providerId?.name || "Unknown Provider"}
                </h3>

                <p className="text-xs text-gray-400">
                  {service.providerId?.email || "No email available"}
                </p>

                <div className="text-yellow-400 text-xs mt-1">
                  {"★".repeat(service.rating || 4)}
                  {"☆".repeat(5 - (service.rating || 4))}
                  <span className="text-gray-400 ml-2">
                    ({service.rating || 4}.0)
                  </span>
                </div>
              </div>
            </div>

            {/* Address */}
            <label className="text-sm text-gray-300">Select Address</label>
            <select
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
              className="w-full mt-2 mb-3 bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-sm outline-none"
            >
              <option value="">-- Select Address --</option>

              {addresses.map((addr) => (
                <option key={addr._id} value={addr._id}>
                  {addr.houseNo}, {addr.area}, {addr.city} - {addr.pincode}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                if (!user) {
                  toast.error("Please login first to add address");
                  navigate("/login");
                  return;
                }
                setShowModal(true);
              }}
              className="text-highlight text-xs hover:underline cursor-pointer"
            >
              + Add New Address
            </button>

            {/* Date */}
            <div className="mt-4">
              <label className="text-sm text-gray-300">Service Date</label>
              <input
                type="date"
                min={today}
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                className="w-full mt-2 bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-sm outline-none"
              />
            </div>

            {/* Preferred Slot */}
            <div className="mt-4">
              <label className="text-sm text-gray-300">
                Preferred Time Slot
              </label>

              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full mt-2 bg-black/40 border border-white/10 px-4 py-3 rounded-xl text-sm outline-none"
              >
                <option value="">-- Select Slot --</option>
                {timeSlots.map((slot) => (
                  <option key={slot.value} value={slot.value}>
                    {slot.label}
                  </option>
                ))}
              </select>

              {preferredTime && (
                <p className="text-xs text-gray-400 mt-2">
                  Selected Slot:{" "}
                  <span className="text-highlight font-semibold">
                    {preferredTime}
                  </span>
                </p>
              )}
            </div>

            <button
              onClick={handleBooking}
              disabled={bookingLoading}
              className="w-full mt-6 bg-highlight text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
            >
              {bookingLoading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 ADDRESS MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4">
          <div className="bg-[rgba(20,22,35,0.95)] p-6 rounded-xl w-full max-w-lg border border-white/20">
            <h2 className="text-lg font-bold mb-4 text-highlight">
              Add Address
            </h2>

            <form
              onSubmit={handleSubmit(onSubmitAddress)}
              className="space-y-3"
            >
              {["houseNo", "street", "area", "pincode"].map((field) => (
                <div key={field} className="flex flex-col gap-1">
                  <input
                    {...register(field)}
                    placeholder={field}
                    className={`w-full border ${
                      errors[field] ? "border-red-300" : "border-white/20"
                    } bg-[rgba(20,22,35,0.55)] rounded-xl py-2 px-3 outline-none text-sm`}
                  />
                  {errors[field] && (
                    <p className="text-red-300 text-sm">
                      {errors[field].message}
                    </p>
                  )}
                </div>
              ))}

              <textarea
                {...register("landmark")}
                placeholder="landmark"
                className="w-full p-2 border border-white/20 rounded-xl bg-transparent"
              />

              {/* State */}
              <select
                value={selectedStateCode}
                onChange={handleStateChange}
                className="w-full border border-white/20 bg-primary rounded-xl py-2 px-3 text-white appearance-none"
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.isoCode} value={s.isoCode}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-300 text-sm">{errors.state.message}</p>
              )}

              {/* City */}
              <select
                {...register("city")}
                disabled={!selectedStateCode}
                className="w-full border border-white/20 bg-primary rounded-xl py-2 px-3 text-white appearance-none disabled:opacity-50"
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
              {errors.city && (
                <p className="text-red-300 text-sm">{errors.city.message}</p>
              )}

              {/* Buttons */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 rounded-xl text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={addressLoading}
                  className="px-4 py-2 bg-primary rounded-xl text-sm font-semibold cursor-pointer disabled:opacity-50"
                >
                  {addressLoading ? "Saving..." : "Save"}
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