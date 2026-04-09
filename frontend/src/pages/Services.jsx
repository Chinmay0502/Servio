import React, { useEffect, useState } from "react";
import axios from "axios";

const Services = () => {
  const [services, setServices] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchServices = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/services/get-all-services",
      );
      setServices(res.data.services);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

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

  const getFilteredServices = () => {
    let filtered = [...services];

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

  const filteredServices = getFilteredServices();

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="fade-up flex justify-between items-end flex-wrap gap-4 mb-10">
          <div>
            <p className="font-highlight text-[.7rem] tracking-[.2em] text-highlight uppercase mb-3">
              All Services
            </p>

            <h2
              className="font-[font1] font-extrabold leading-tight"
              style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)" }}
            >
              All Services
            </h2>
          </div>
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

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 fade-up">
          {filteredServices.map((service) => (
            <div
              key={service._id}
              className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-primary"
            >
              {service.images && service.images.length > 0 ? (
                <div className="w-full h-44 overflow-x-auto flex snap-x snap-mandatory scroll-smooth no-scrollbar">
                  {service.images.map((img, index) => (
                    <img
                      key={index}
                      src={img?.url}
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

              {/* CONTENT SECTION */}
              <div className="p-6">
                {/* Provider Section */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 ">
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
                      {service.categoryId?.name || "Category"}
                    </div>
                  </div>
                </div>

                {/* Service Name */}
                <h4 className="font-semibold text-lg mb-1 line-clamp-1">
                  {service.name}
                </h4>

                {/* Description */}
                <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                  {service.description}
                </p>

                {/* Price */}
                <p className="text-sm font-semibold text-white">
                  ₹{service.price}
                  <span className="text-gray-500 text-xs font-normal">
                    {" "}
                    / visit
                  </span>
                </p>

                {/* Button */}
                <button className="w-full mt-4 border border-highlight text-highlight rounded-xl py-2 text-xs font-semibold hover:bg-highlight/10 hover:text-white transition-colors cursor-pointer">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* If No Services */}
        {filteredServices.length === 0 && (
          <p className="text-gray-400 text-sm mt-10 text-center">
            No services found for this filter.
          </p>
        )}
      </div>
    </section>
  );
};

export default Services;
