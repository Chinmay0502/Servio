import React, { useEffect, useState } from "react";
import axios from "axios";

const Request_Section = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/admin/get-all-provider-requests",
        { withCredentials: true }
      );
      console.log(res.data.requests);
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
        { withCredentials: true }
      );

      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (error) {
      console.log(error.response?.data);
    }
  };

  return (
    <div className="h-[35rem] w-full border border-white/20 rounded-xl p-4 mb-5">
      
      <h2 className="text-2xl font-bold mb-4">Service Requests</h2>

      <div className="h-[30rem] overflow-y-auto flex flex-col gap-4 pr-2">

        {requests.length === 0 && (
          <p className="bg-[rgba(20,22,35,0.55)] text-gray-400 p-3 rounded">
            No pending requests
          </p>
        )}

        {requests.map((req) => (
          <div
            key={req._id}
            className="border border-white/20 p-6 rounded-xl flex flex-col gap-3 bg-[rgba(20,22,35,0.55)] shadow"
          >
            <h3 className="text-lg font-semibold">
              {req.providerId?.name}
            </h3>

            <p>Email: {req.providerId?.email}</p>

            <p>
              <span className="font-semibold">Category:</span>{" "}
              {req.categoryId?.name}
            </p>

            <p>
              <span className="font-semibold">Service:</span>{" "}
              {req.subCategory?.name}
            </p>

            <p>
              <span className="font-semibold">Description:</span>{" "}
              {req.subCategory?.description}
            </p>

            <p>
              <span className="font-semibold">Price:</span> ₹
              {req.subCategory?.price}
            </p>

            <div className="flex gap-4 mt-2">
              <button
                onClick={() => handleDecision(req._id, "ACCEPT")}
                className="bg-green-500 text-white px-3 py-2 rounded text-sm font-semibold cursor-pointer"
              >
                Approve
              </button>

              <button
                onClick={() => handleDecision(req._id, "REJECT")}
                className="bg-red-500 text-white px-3 py-2 rounded text-sm font-semibold cursor-pointer"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Request_Section;