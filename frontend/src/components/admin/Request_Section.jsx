import React, { useEffect, useState } from "react";
import axios from "axios";

const Request_Section = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/admin/get-all-provider-requests",
        { withCredentials: true },
      );
      setRequests(res.data.requests);
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDecision = async (id, decision) => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/service-provider-status/${id}`,
        { decision },
        { withCredentials: true },
      );

      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
    <div className="w-full border border-white/10 rounded-2xl p-6 mb-6 bg-gradient-to-br from-[#0d0d1a] via-[#12122a] to-[#0d0d1a] shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <p className="text-[0.75rem] font-mono tracking-[0.3em] text-pink-400 uppercase">
            Admin Panel
          </p>
          <h2 className="text-3xl font-extrabold text-white">
            Service Requests
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Review provider service requests and approve/reject them.
          </p>
        </div>

        <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300">
          Pending:{" "}
          <span className="text-white font-semibold">{requests.length}</span>
        </div>
      </div>

      {/* Scrollable Section */}
      <div className="h-[26rem] overflow-y-auto flex flex-col gap-5 pr-2 custom-scroll">
        {requests.length === 0 && (
          <div className="bg-white/5 border border-white/10 text-gray-400 p-4 rounded-xl">
            No pending requests
          </div>
        )}

        {requests.map((req) => (
          <div
            key={req._id}
            className="border border-white/10 rounded-2xl p-6 bg-white/5 backdrop-blur-md shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:border-purple-500/40"
          >
            {/* Top section */}
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {req.providerId?.name}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {req.providerId?.email}
                </p>
              </div>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300">
                {req.categoryId?.name}
              </span>
            </div>

            {/* Service Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div className="p-4 rounded-xl border border-white/10 bg-black/20">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-mono">
                  Service Name
                </p>
                <p className="text-white font-semibold mt-1">
                  {req.subCategory?.name}
                </p>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-black/20">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-mono">
                  Price
                </p>
                <p className="text-green-400 font-bold mt-1 text-lg">
                  ₹{req.subCategory?.price}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4 p-4 rounded-xl border border-white/10 bg-black/20">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-mono">
                Description
              </p>
              <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                {req.subCategory?.description}
              </p>
            </div>

            {/* Images Section */}
            {req.subCategory?.images?.length > 0 && (
              <div className="mt-5">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-mono mb-3">
                  Service Images ({req.subCategory.images.length})
                </p>

                <div className="flex gap-3 overflow-x-auto pb-2">
                  {req.subCategory.images.map((img, index) => (
                    <div
                      key={index}
                      className="min-w-[160px] h-[110px] rounded-xl overflow-hidden border border-white/10 bg-black/20 hover:border-purple-500/40 transition-all duration-300"
                    >
                      <img
                        src={img.url}
                        alt={`service-${index}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => handleDecision(req._id, "ACCEPT")}
                className="flex-1 bg-highlight/70 cursor-pointer hover:bg-highlight text-white px-4 py-3 rounded-xl text-sm font-bold tracking-wide hover:opacity-90 transition-all"
              >
                Approve
              </button>

              <button
                onClick={() => handleDecision(req._id, "REJECT")}
                className="flex-1 bg-primary/70 hover:bg-primary cursor-pointer text-white px-4 py-3 rounded-xl text-sm font-bold tracking-wide hover:opacity-90 transition-all"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Scrollbar */}
      <style>
        {`
          .custom-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: rgba(168, 85, 247, 0.4);
            border-radius: 10px;
          }
          .custom-scroll::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
          }
        `}
      </style>
    </div>
  );
};

export default Request_Section;
