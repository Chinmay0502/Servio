import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const TaskDetails = () => {
  const { taskId } = useParams();
  const token = useSelector((state) => state.user.token);

  const [task, setTask] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignLoading, setAssignLoading] = useState(false);

  // ==================== Fetch Task Details ====================
  const fetchTaskDetails = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:8000/api/task/provider/${taskId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTask(res.data.task);
    } catch (error) {
      console.log("Error fetching task details:", error.response?.data || error.message);
      toast.error("Failed to fetch task details!");
    } finally {
      setLoading(false);
    }
  };

  // ==================== Fetch Provider Workers ====================
  const fetchWorkers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/worker/provider-workers",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setWorkers(res.data.workers || []);
    } catch (error) {
      console.log("Error fetching workers:", error.response?.data || error.message);
      toast.error("Failed to fetch workers!");
    }
  };

  // ==================== Assign Workers API ====================
  const assignWorkers = async () => {
    if (selectedWorkers.length === 0) {
      return toast.error("Please select at least 1 worker!");
    }

    try {
      setAssignLoading(true);

      const res = await axios.patch(
        `http://localhost:8000/api/task/${taskId}/assign`,
        { workerIds: selectedWorkers },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message || "Workers assigned successfully!");
      setSelectedWorkers([]);
      fetchTaskDetails();
    } catch (error) {
      console.log("Error assigning workers:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to assign workers!");
    } finally {
      setAssignLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
    fetchWorkers();
  }, []);

  // ==================== Toggle Worker Selection ====================
  const toggleWorkerSelection = (workerId) => {
    setSelectedWorkers((prev) =>
      prev.includes(workerId)
        ? prev.filter((id) => id !== workerId)
        : [...prev, workerId]
    );
  };

  // ==================== Status Color ====================
  const getStatusColor = (status) => {
    if (status === "PENDING") return "bg-yellow-500/20 text-yellow-300";
    if (status === "ACCEPTED") return "bg-blue-500/20 text-blue-300";
    if (status === "REJECTED") return "bg-red-500/20 text-red-300";
    if (status === "WORKER_ASSIGNED") return "bg-purple-500/20 text-purple-300";
    if (status === "STARTED") return "bg-indigo-500/20 text-indigo-300";
    if (status === "COMPLETED") return "bg-green-500/20 text-green-300";
    return "bg-gray-500/20 text-gray-300";
  };

  // ==================== Loading UI ====================
  if (loading) {
    return (
      <p className="text-white/60 text-center py-10">
        Loading Task Details...
      </p>
    );
  }

  if (!task) {
    return <p className="text-white/60 text-center py-10">Task not found.</p>;
  }

  return (
    <div className="px-5 sm:px-6 lg:px-12 py-6 mt-10">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">📌 Task Details</h1>
          <p className="text-white/60 mt-1 text-sm">
            View full information about this booking request.
          </p>
        </div>

        <Link
          to="/serviceProvider/requests"
          className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm"
        >
          ← Back to Requests
        </Link>
      </div>

      {/* Task Info */}
      <div className="bg-[#11112a] border border-white/10 rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h2 className="text-xl font-bold text-white">
            {task.serviceId?.name || "Service"}
          </h2>

          <span
            className={`px-4 py-2 rounded-full text-xs font-semibold ${getStatusColor(
              task.status
            )}`}
          >
            {task.status}
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6 text-sm text-white/70">
          <p>
            💰 <span className="text-white font-semibold">Price:</span> ₹{" "}
            {task.price || 0}
          </p>

          <p>
            📅 <span className="text-white font-semibold">Service Date:</span>{" "}
            {task.serviceDate
              ? new Date(task.serviceDate).toLocaleDateString()
              : "N/A"}
          </p>

          <p>
            ⏰{" "}
            <span className="text-white font-semibold">Preferred Time:</span>{" "}
            {task.preferredTime || "N/A"}
          </p>

          <p>
            📌 <span className="text-white font-semibold">City:</span>{" "}
            {task.addressId?.city || "N/A"}
          </p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-[#11112a] border border-white/10 rounded-2xl p-6 shadow-lg mb-8">
        <h2 className="text-lg font-bold text-white mb-4">👤 Customer Info</h2>

        <div className="flex items-center gap-4">
          <img
            src={task.userId?.url || "/Profile_Image.jpg"}
            alt="customer"
            className="w-14 h-14 rounded-full object-cover border border-white/10"
          />

          <div>
            <p className="text-white font-semibold text-lg">
              {task.userId?.name || "Unknown"}
            </p>
            <p className="text-white/60 text-sm">
              📞 {task.userId?.phone || "Not Available"}
            </p>
          </div>
        </div>
      </div>

      {/* Assign Worker Section */}
      {task.status === "ACCEPTED" && (
        <div className="bg-[#11112a] border border-white/10 rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-lg font-bold text-white mb-4">
            👷 Assign Workers
          </h2>

          {workers.length === 0 ? (
            <p className="text-white/60 text-sm">No workers available.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {workers.map((worker) => (
                <div
                  key={worker._id}
                  onClick={() => toggleWorkerSelection(worker._id)}
                  className={`cursor-pointer flex items-center gap-4 p-4 rounded-xl border transition ${
                    selectedWorkers.includes(worker._id)
                      ? "bg-purple-600/20 border-purple-500/40"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <img
                    src={worker.image || "/Profile_Image.jpg"}
                    alt="worker"
                    className="w-12 h-12 rounded-full object-cover border border-white/10"
                  />

                  <div>
                    <p className="text-white font-semibold">{worker.name}</p>
                    <p className="text-white/60 text-sm">
                      📞 {worker.phone || worker.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={assignWorkers}
            disabled={assignLoading}
            className="mt-6 px-6 py-3 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/40 hover:bg-purple-600/30 transition disabled:opacity-50"
          >
            {assignLoading ? "Assigning..." : "Assign Selected Workers"}
          </button>
        </div>
      )}

      {/* Assigned Workers Display */}
      <div className="bg-[#11112a] border border-white/10 rounded-2xl p-6 shadow-lg">
        <h2 className="text-lg font-bold text-white mb-4">
          👷 Assigned Workers
        </h2>

        {task.workers?.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-5">
            {task.workers.map((worker) => (
              <div
                key={worker._id}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <img
                  src={worker.image || "/Profile_Image.jpg"}
                  alt="worker"
                  className="w-12 h-12 rounded-full object-cover border border-white/10"
                />

                <div>
                  <p className="text-white font-semibold">{worker.name}</p>
                  <p className="text-white/60 text-sm">
                    📞 {worker.phone || worker.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/60 text-sm">
            No workers assigned for this task yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;