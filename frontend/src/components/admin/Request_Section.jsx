import React, { useEffect, useState } from "react";
import axios from "axios";

const Request_Section = () => {
  const [requests, setRequests] = useState([]);
  const [loadingId, setLoadingId] = useState(null); // ✅ loader per button

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/admin/get-all-provider-requests",
        { withCredentials: true }
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
      setLoadingId(id); // ✅ start loader

      await axios.put(
        `http://localhost:8000/api/admin/service-provider-status/${id}`,
        { decision },
        { withCredentials: true }
      );

      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (error) {
      console.log(error.response?.data);
    } finally {
      setLoadingId(null); // ✅ stop loader
    }
  };

  return (
    <div className="w-full border border-white/10 rounded-2xl p-6 mb-6 bg-gradient-to-br from-[#0d0d1a] via-[#12122a] to-[#0d0d1a] shadow-xl">

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
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

      {/* LIST */}
      <div className="h-[26rem] overflow-y-auto flex flex-col gap-5 pr-2 custom-scroll">

        {requests.length === 0 && (
          <div className="bg-white/5 border border-white/10 text-gray-400 p-4 rounded-xl">
            No pending requests
          </div>
        )}

        {requests.map((req) => (
          <div
            key={req._id}
            className="border border-white/10 rounded-2xl p-6 bg-white/5"
          >

            {/* TOP */}
            <div className="flex justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {req.providerId?.name}
                </h3>
                <p className="text-gray-400 text-sm">
                  {req.providerId?.email}
                </p>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300">
                {req.categoryId?.name}
              </span>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 mt-6">

              {/* APPROVE */}
              <button
                disabled={loadingId === req._id}
                onClick={() => handleDecision(req._id, "ACCEPT")}
                className="flex-1 bg-green-500/70 hover:bg-green-500 text-white px-4 py-3 rounded-xl text-sm font-bold flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {loadingId === req._id ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="4"
                        opacity="0.3"
                      />
                      <path
                        fill="white"
                        d="M4 12a8 8 0 018-8v8H4z"
                        opacity="0.8"
                      />
                    </svg>
                    Processing
                  </>
                ) : (
                  "Approve"
                )}
              </button>

              {/* REJECT */}
              <button
                disabled={loadingId === req._id}
                onClick={() => handleDecision(req._id, "REJECT")}
                className="flex-1 bg-red-500/70 hover:bg-red-500 text-white px-4 py-3 rounded-xl text-sm font-bold flex justify-center items-center gap-2 disabled:opacity-50"
              >
                {loadingId === req._id ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="white"
                        strokeWidth="4"
                        opacity="0.3"
                      />
                      <path
                        fill="white"
                        d="M4 12a8 8 0 018-8v8H4z"
                        opacity="0.8"
                      />
                    </svg>
                    Processing
                  </>
                ) : (
                  "Reject"
                )}
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* SCROLLBAR */}
      <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.4);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};

export default Request_Section;