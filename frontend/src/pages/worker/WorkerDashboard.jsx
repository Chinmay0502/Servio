import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { Play } from "lucide-react";

const WorkerDashboard = () => {
  const navigate = useNavigate();

  const workerToken = localStorage.getItem("workerToken");
  const workerData = JSON.parse(localStorage.getItem("workerData"));

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionType, setActionType] = useState("start");


  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [startLoading, setStartLoading] = useState(false);

  const fetchWorkerTasks = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:8000/api/task/worker", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${workerToken}`,
        },
      });

      setTasks(res.data.tasks || []);
    } catch (error) {
      console.log(error.response?.data || error.message);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again!");
        handleLogout();
      } else {
        toast.error("Failed to fetch worker tasks!");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!workerToken) {
      toast.error("Please login first!");
      navigate("/worker/login");
      return;
    }

    fetchWorkerTasks();
  }, []);

  const handleGenerateOtp = async (taskId, type = "start") => {
    try {
      await axios.post(
        `http://localhost:8000/api/task/${taskId}/generate-otp`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${workerToken}`,
          },
        }
      );

      toast.success("OTP sent to customer!");

      setSelectedTaskId(taskId);
      setActionType(type); 
      setOtpModal(true);
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to generate OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 4) {
      return toast.error("Please enter valid 4-digit OTP");
    }

    try {
      setStartLoading(true);

      const endpoint =
        actionType === "start"
          ? `http://localhost:8000/api/task/${selectedTaskId}/start`
          : `http://localhost:8000/api/task/${selectedTaskId}/complete`;

      const res = await axios.patch(
        endpoint,
        { otp },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${workerToken}`,
          },
        }
      );

      toast.success(res.data.message);

      setOtpModal(false);
      setOtp("");
      setSelectedTaskId(null);
      fetchWorkerTasks();
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setStartLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("workerToken");
    localStorage.removeItem("workerData");
    toast.success("Logged out successfully!");
    navigate("/worker/login");
  };

  const activeTasks = tasks.filter(
    (t) => t.status === "WORKER_ASSIGNED" || t.status === "STARTED"
  );

  const pastTasks = tasks.filter(
    (t) => t.status === "COMPLETED" || t.status === "CANCELLED"
  );

  const getStatusColor = (status) => {
    if (status === "WORKER_ASSIGNED") return "bg-purple-500/20 text-purple-300";
    if (status === "STARTED") return "bg-blue-500/20 text-blue-300";
    if (status === "COMPLETED") return "bg-green-500/20 text-green-300";
    if (status === "CANCELLED") return "bg-red-500/20 text-red-300";
    return "bg-gray-500/20 text-gray-300";
  };

  return (
    <div className="min-h-screen px-6 py-10 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {workerData?.name || "Worker"} 👷
            </h1>
            <p className="text-white/60 text-sm mt-1">
              Manage your tasks and work history
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="px-5 py-3 rounded-xl bg-red-600/20 border border-red-500/30 text-red-300 hover:bg-red-600/30 transition"
          >
            🚪 Logout
          </button>
        </div>

        {/* Worker Profile */}
        <div className="bg-[#11112a] border border-white/10 rounded-2xl p-6 shadow-lg mb-10">
          <h2 className="text-xl font-bold mb-4">👤 My Profile</h2>

          <div className="grid sm:grid-cols-2 gap-4 text-white/80 text-sm">
            <p>
              <span className="text-white/50">Name:</span>{" "}
              {workerData?.name || "N/A"}
            </p>
            <p>
              <span className="text-white/50">Email:</span>{" "}
              {workerData?.email || "N/A"}
            </p>
            <p>
              <span className="text-white/50">Phone:</span>{" "}
              {workerData?.phone || "N/A"}
            </p>
            <p>
              <span className="text-white/50">Role:</span>{" "}
              {workerData?.role || "WORKER"}
            </p>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="bg-[#11112a] border border-white/10 rounded-2xl p-6 shadow-lg mb-10">
          <h2 className="text-xl font-bold mb-4">📌 Active Tasks</h2>

          {loading ? (
            <p className="text-white/60 text-center py-6">Loading tasks...</p>
          ) : activeTasks.length === 0 ? (
            <p className="text-white/60 text-sm">No active tasks assigned.</p>
          ) : (
            <div className="space-y-4">
              {activeTasks.map((task) => (
                <div
                  key={task._id}
                  className="p-5 rounded-xl bg-black/20 border border-white/10 flex justify-between items-center flex-wrap gap-4"
                >
                  <div>
                    <p className="font-semibold text-lg">
                      {task.serviceId?.name || "Service Task"}
                    </p>
                    <p className="text-sm text-white/60">
                      📍 {task.addressId?.city || "N/A"} | 📅{" "}
                      {task.serviceDate
                        ? new Date(task.serviceDate).toLocaleDateString()
                        : "N/A"}{" "}
                      | ⏰ {task.preferredTime || "N/A"}
                    </p>

                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    {task.status === "WORKER_ASSIGNED" && (
                      <button
                        onClick={() => handleGenerateOtp(task._id, "start")}
                        className="px-5 py-2 rounded-xl bg-green-600/20 border border-green-500/30 text-green-300 hover:bg-green-600/30 transition flex gap-2 items-center"
                      >
                        <Play className="size-5" /> Start Task
                      </button>
                    )}

                    {task.status === "STARTED" && (
                      <button
                        onClick={() => handleGenerateOtp(task._id, "complete")}
                        className="px-5 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 hover:bg-blue-600/30 transition flex gap-2 items-center"
                      >
                        ✅ Complete Task
                      </button>
                    )}

                    <Link
                      to={`/worker/task/${task._id}`}
                      className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Tasks */}
        <div className="bg-[#11112a] border border-white/10 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4">📜 Past Tasks</h2>

          {loading ? (
            <p className="text-white/60 text-center py-6">Loading tasks...</p>
          ) : pastTasks.length === 0 ? (
            <p className="text-white/60 text-sm">No past tasks found.</p>
          ) : (
            <div className="space-y-4">
              {pastTasks.map((task) => (
                <div
                  key={task._id}
                  className="p-5 rounded-xl bg-black/20 border border-white/10 flex justify-between items-center flex-wrap gap-4"
                >
                  <div>
                    <p className="font-semibold text-lg">
                      {task.serviceId?.name || "Service Task"}
                    </p>

                    <p className="text-sm text-white/60">
                      📍 {task.addressId?.city || "N/A"} | 📅{" "}
                      {task.serviceDate
                        ? new Date(task.serviceDate).toLocaleDateString()
                        : "N/A"}
                    </p>

                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {task.status}
                    </span>
                  </div>

                  <Link
                    to={`/worker/task/${task._id}`}
                    className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* OTP Modal */}
      {otpModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-[#11112a] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-2 text-white">
              {actionType === "start"
                ? "Enter OTP to Start Task"
                : "Enter OTP to Complete Task"}
            </h2>

            <p className="text-sm text-white/60 mb-4">
              Customer will provide OTP. Enter it below.
            </p>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={4}
              placeholder="Enter 4 digit OTP"
              className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none text-white mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setOtpModal(false);
                  setOtp("");
                }}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleVerifyOtp}
                disabled={startLoading}
                className="px-4 py-2 rounded-xl bg-green-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {startLoading
                  ? actionType === "start"
                    ? "Starting..."
                    : "Completing..."
                  : actionType === "start"
                    ? "Start"
                    : "Complete"}
              </button>

              <button
                onClick={() => handleGenerateOtp(selectedTaskId)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerDashboard;