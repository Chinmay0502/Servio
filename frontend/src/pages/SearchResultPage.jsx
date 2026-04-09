// pages/SearchResultPage.jsx

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ServiceCard from "../components/ServiceCard";

const SearchResultPage = () => {
  const [params] = useSearchParams();
  const query = params.get("q");

  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState({});
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchResults = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/services/search?q=${query}`
      );

      setServices(res.data.services);
      setFilters(res.data.filters);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (query) fetchResults();
  }, [query]);

  // Filter logic
  const filteredServices = services.filter((s) => {
    if (activeFilter === "all") return true;
    return s.categoryId?._id === activeFilter;
  });

  return (
    <div className="px-6 py-20 max-w-7xl mx-auto">
      {/* Heading */}
      <div className="mb-10">
        <p className="text-highlight uppercase text-xs tracking-widest">
          Search Results
        </p>

        <h2 className="text-3xl font-bold text-white mt-2">
          {query}
        </h2>

        <p className="text-gray-400 text-sm mt-1">
          {services.length} services found
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActiveFilter("all")}
          className={`px-4 py-2 rounded-full text-xs border ${
            activeFilter === "all"
              ? "bg-highlight text-white"
              : "text-gray-300 border-white/10"
          }`}
        >
          All
        </button>

        {filters.categories?.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setActiveFilter(cat._id)}
            className={`px-4 py-2 rounded-full text-xs border ${
              activeFilter === cat._id
                ? "bg-highlight text-white"
                : "text-gray-300 border-white/10"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredServices.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>

      {/* Empty */}
      {filteredServices.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No services found
        </p>
      )}
    </div>
  );
};

export default SearchResultPage;