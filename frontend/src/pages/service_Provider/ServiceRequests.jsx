import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const ServiceRequests = () => {
  const token = useSelector((state) => state.user.token);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:8000/api/task/provider", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data.tasks || []);
    } catch (error) {
      console.log("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const getStatusColor = (status) => {
    if (status === "PENDING") return "bg-yellow-500/20 text-yellow-300";
    if (status === "ACCEPTED") return "bg-blue-500/20 text-blue-300";
    if (status === "REJECTED") return "bg-red-500/20 text-red-300";
    if (status === "WORKER_ASSIGNED") return "bg-purple-500/20 text-purple-300";
    if (status === "STARTED") return "bg-indigo-500/20 text-indigo-300";
    if (status === "COMPLETED") return "bg-green-500/20 text-green-300";

    return "bg-gray-500/20 text-gray-300";
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">📩 Service Requests</h1>
      <p className="text-white/60 mb-8">
        Here you will see all booking requests from customers.
      </p>

      {loading ? (
        <p className="text-white/60 text-center py-10">Loading requests...</p>
      ) : tasks.length === 0 ? (
        <p className="text-white/60 text-center py-10">
          No service requests available.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-[#11112a] border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white">
                  {task.serviceId?.name || "Service"}
                </h2>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>

              {/* Customer */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={task.userId?.url || "/Profile_Image.jpg"}
                  alt="customer"
                  className="w-12 h-12 rounded-full object-cover border border-white/10"
                />
                <div>
                  <p className="font-semibold text-white">
                    {task.userId?.name || "Unknown Customer"}
                  </p>
                  <p className="text-sm text-white/60">
                    {task.userId?.phone || "No Phone"}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="text-sm text-white/70 space-y-2">
                <p>💰 Price: ₹ {task.price || 0}</p>

                <p>
                  📅 Date:{" "}
                  {task.serviceDate
                    ? new Date(task.serviceDate).toLocaleDateString()
                    : "N/A"}
                </p>

                <p>
                  ⏰ Time:{" "}
                  {task.preferredTime?.length > 0
                    ? task.preferredTime
                    : "N/A"}
                </p>

                <p>📍 City: {task.addressId?.city || "N/A"}</p>
              </div>

              {/* Action */}
              <div className="mt-5 flex justify-end gap-3">
                <button className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;