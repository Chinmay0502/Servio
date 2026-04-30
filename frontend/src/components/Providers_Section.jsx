import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Providers_Section = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(false);

  const filterButtons = [
    { label: "All", value: "all" },
    { label: "Electrician", value: "electrical services" },
    { label: "Plumbing", value: "plumbing" },
    { label: "Painting", value: "painting" },
    { label: "AC Repair", value: "ac" },
    { label: "Top Rated", value: "topRated" },
    { label: "Price: Low → High", value: "lowHigh" },
    { label: "Price: High → Low", value: "highLow" },
  ];

  // Fetch Services
  const fetchServices = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:8000/api/services/get-all-services",
      );
      console.log(res.data.services);
      setServicesData(res.data.services || []);
    } catch (error) {
      console.log(error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filter + Sort Services
  const getFilteredServices = () => {
    let filtered = [...servicesData];

    if (
      activeFilter !== "all" &&
      activeFilter !== "topRated" &&
      activeFilter !== "lowHigh" &&
      activeFilter !== "highLow"
    ) {
      filtered = filtered.filter(
        (s) => s.categoryId?.name?.toLowerCase() === activeFilter,
      );
    }

    if (activeFilter === "topRated") {
      filtered = filtered.filter((s) => (s.rating || 0) >= 5);
    }

    if (activeFilter === "lowHigh") {
      filtered = filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    }

    if (activeFilter === "highLow") {
      filtered = filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return filtered;
  };

  const services = getFilteredServices();

  return (
    <section id="providers" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="fade-up flex justify-between items-end flex-wrap gap-4 mb-10">
          <div>
            <p className="font-mono text-[.7rem] tracking-[.2em] text-highlight uppercase mb-3">
              Featured Services
            </p>

            <h2
              className="font-syne font-[font1] font-bold leading-tight"
              style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)" }}
            >
              Choose the best
              <br />
              services near you
            </h2>
          </div>

          <Link
            to={"/services"}
            className="border border-primary/80 text-white px-5 py-2 rounded-lg text-sm hover:border-primary transition-colors cursor-pointer"
          >
            Browse All Services →
          </Link>
        </div>

        {/* Filter Buttons */}
        <div className="fade-up flex flex-wrap gap-2 mb-10">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => setActiveFilter(btn.value)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 border cursor-pointer 
              ${
                activeFilter === btn.value
                  ? "bg-pink text-white border-pink shadow-[0_0_25px_rgba(232,24,92,.25)]"
                  : "bg-primary/5 text-gray-300 border-primary/80 hover:border-primary/100"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-gray-400 text-sm mt-10 text-center">
            Loading services...
          </p>
        )}

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 fade-up">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_16px_40px_rgba(108,59,232,.15)]"
            >
              {/* 🔥 TOP IMAGE SLIDER */}
              {service.images && service.images.length > 0 ? (
                <div className="w-full h-44 overflow-x-auto flex snap-x snap-mandatory scroll-smooth no-scrollbar">
                  {service.images.map((img, index) => (
                    <img
                      key={index}
                      src={img?.url} // ✅ cloudinary url
                      alt={`service-${index}`}
                      className="w-full h-44 object-cover flex-shrink-0 snap-center"
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full h-44 bg-black/30 flex items-center justify-center text-gray-500 text-sm">
                  No Image Available
                </div>
              )}

              {/* CONTENT */}
              <div className="p-6">
                {/* Provider Section */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-white/10 hover:ring-highlight/60 transition-all duration-300">
                    <img
                      src={
                        service.providerId?.image?.url || "/Profile_Image.jpg"
                      }
                      alt="provider"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="font-bold text-sm">
                      {service.providerId?.name || "Unknown Provider"}
                    </div>

                    <div className="text-gray-400 text-xs">
                      {service.categoryId?.name || "Category"} · ₹
                      {service.price}
                    </div>

                    <div className="text-yellow-400 text-xs mt-0.5">
                      {"★".repeat(service.rating || 4)}
                      {"☆".repeat(5 - (service.rating || 4))}
                    </div>
                  </div>
                </div>

                {/* Service Name */}
                <h3 className="text-white font-semibold text-sm mb-2">
                  {service.name}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-xs leading-relaxed mb-4 line-clamp-3">
                  {service.description || "No description available."}
                </p>

                {/* Price */}
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm font-semibold text-white">
                    ₹{service.price}
                    <span className="text-gray-500 text-xs font-normal">
                      {" "}
                      / visit
                    </span>
                  </p>
                </div>

                {/* Button
                <button className="w-full border border-highlight text-highlight rounded-xl py-2 text-xs font-semibold hover:bg-highlight/10 hover:text-white transition-colors cursor-pointer">
                  Book Now
                </button> */}
                <Link
                  to={`/service/${service._id}`}
                  className="block w-full text-center border border-highlight text-highlight rounded-xl py-2 text-xs font-semibold hover:bg-highlight/10 hover:text-white transition-colors cursor-pointer"
                >
                  Book Now
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No services */}
        {!loading && services.length === 0 && (
          <p className="text-gray-400 text-sm mt-10 text-center">
            No services found for this filter.
          </p>
        )}
      </div>
    </section>
  );
};

export default Providers_Section;
