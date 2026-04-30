import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const ServiceProvider_Dashboard = () => {
  const user = useSelector((state) => state.user.value);
  const token = useSelector((state) => state.user.token);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondLoading, setRespondLoading] = useState(null);

  // Fetch Provider Tasks
  const fetchProviderTasks = async () => {
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
      console.log("Error fetching provider tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Respond to Task (Accept / Reject)
  const respondTask = async (taskId, action) => {
    try {
      setRespondLoading(taskId);

      await axios.patch(
        `http://localhost:8000/api/task/${taskId}/respond`,
        { action },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`Request ${action === "ACCEPT" ? "Accepted" : "Rejected"}!`);

      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (error) {
      console.log("Error responding task:", error);
      toast.error("Something went wrong!");
    } finally {
      setRespondLoading(null);
    }
  };

  useEffect(() => {
    fetchProviderTasks();
  }, []);

  // Stats calculation
  const totalRequests = tasks.length;

  const completedRequests = tasks.filter(
    (task) => task.status === "COMPLETED"
  ).length;

  const pendingRequests = tasks.filter(
    (task) => task.status === "PENDING"
  ).length;

  const earnings = tasks
    .filter((task) => task.status === "COMPLETED")
    .reduce((sum, task) => sum + (task.price || 0), 0);

  // Recent tasks (latest 5)
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome, {user?.name || "Service Provider"} 👋
          </h1>
          <p className="text-white/60 mt-1 text-sm">
            Manage your service requests, earnings, and profile.
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link
            to="/serviceProvider/add-service"
            className="px-5 py-3 rounded-xl bg-highlight/20 hover:bg-highlight/50 transition font-semibold text-sm shadow-lg border border-highlight/40"
          >
            ➕ Add New Service
          </Link>

          {/* ✅ NEW BUTTON */}
          <Link
            to="/serviceProvider/add-worker"
            className="px-5 py-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/40 transition font-semibold text-sm shadow-lg border border-blue-400/30"
          >
            👷 Add Worker
          </Link>

          <Link
            to="/service-provider/requests"
            className="px-5 py-3 rounded-xl bg-primary hover:bg-primary-700 transition font-semibold text-sm shadow-lg"
          >
            View All Requests
          </Link>
        </div>
      </div>

      {/* Profile + Stats */}
      <div className="grid lg:grid-cols-4 gap-6 mb-10">
        {/* Profile Card */}
        <div className="lg:col-span-1 bg-[#11112a] border border-white/10 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10">
              <img
                src={user?.image || "/Profile_Image.jpg"}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h2 className="font-bold text-lg">
                {user?.name || "Provider Name"}
              </h2>
              <p className="text-sm text-white/60">
                {user?.serviceCategory || user?.role || "Service Provider"}
              </p>
            </div>
          </div>

          <div className="mt-5 text-sm text-white/70 space-y-2">
            <p>📍 {user?.city || user?.address || "Bhubaneswar, India"}</p>
            <p>📞 {user?.phone || "Not Available"}</p>
            <p>📧 {user?.email || "Not Available"}</p>
          </div>

          <Link
            to="/service-provider/profile"
            className="block mt-6 text-center py-2 rounded-xl bg-white/5 hover:bg-white/10 transition text-sm"
          >
            Edit Profile
          </Link>
        </div>

        {/* Stats */}
        <div className="lg:col-span-3 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#11112a] border border-white/10 rounded-2xl p-6 shadow-md">
            <p className="text-white/60 text-sm">Total Requests</p>
            <h2 className="text-2xl font-bold mt-2">{totalRequests}</h2>
          </div>

          <div className="bg-[#11112a] border border-white/10 rounded-2xl p-6 shadow-md">
            <p className="text-white/60 text-sm">Completed</p>
            <h2 className="text-2xl font-bold mt-2 text-green-400">
              {completedRequests}
            </h2>
          </div>

          <div className="bg-[#11112a] border border-white/10 rounded-2xl p-6 shadow-md">
            <p className="text-white/60 text-sm">Pending</p>
            <h2 className="text-2xl font-bold mt-2 text-yellow-400">
              {pendingRequests}
            </h2>
          </div>

          <div className="bg-[#11112a] border border-white/10 rounded-2xl p-6 shadow-md">
            <p className="text-white/60 text-sm">Earnings</p>
            <h2 className="text-2xl font-bold mt-2 text-purple-400">
              ₹ {earnings}
            </h2>
          </div>
        </div>
      </div>

      {/* Recent Requests Table */}
      <div className="bg-[#11112a] border border-white/10 rounded-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Recent Requests</h2>

          <Link
            to="/service-provider/requests"
            className="text-sm text-purple-400 hover:underline"
          >
            See More →
          </Link>
        </div>

        {loading ? (
          <p className="text-white/60 text-center py-6">Loading tasks...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-white/60 border-b border-white/10">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Service</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Preferred Times</th>
                  <th className="pb-3">City</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {recentTasks.length > 0 ? (
                  recentTasks.map((task) => (
                    <tr
                      key={task._id}
                      className="border-b border-white/5 hover:bg-white/5 transition"
                    >
                      <td className="py-4">{task.userId?.name || "Unknown"}</td>

                      <td className="py-4">
                        {task.serviceId?.name || "Service"}
                      </td>

                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${
                            task.status === "PENDING"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : task.status === "COMPLETED"
                              ? "bg-green-500/20 text-green-300"
                              : task.status === "ACCEPTED"
                              ? "bg-blue-500/20 text-blue-300"
                              : task.status === "REJECTED"
                              ? "bg-red-500/20 text-red-300"
                              : "bg-purple-500/20 text-purple-300"
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>

                      <td className="py-4 text-white/80">₹ {task.price}</td>

                      <td className="py-4 text-white/80">
                        {task.preferredTime?.length > 0
                          ? task.preferredTime
                          : "N/A"}
                      </td>

                      <td>{task.addressId?.city}</td>

                      <td className="py-4 text-right flex gap-2 justify-end">
                        {task.status === "PENDING" ? (
                          <>
                            <button
                              disabled={respondLoading === task._id}
                              onClick={() => respondTask(task._id, "ACCEPT")}
                              className="px-4 py-2 rounded-xl bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30 transition cursor-pointer disabled:opacity-50"
                            >
                              {respondLoading === task._id ? "..." : "Accept"}
                            </button>

                            <button
                              disabled={respondLoading === task._id}
                              onClick={() => respondTask(task._id, "REJECT")}
                              className="px-4 py-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 transition cursor-pointer disabled:opacity-50"
                            >
                              {respondLoading === task._id ? "..." : "Reject"}
                            </button>
                          </>
                        ) : (
                          <Link
                            to={`/serviceDetails/${task._id}`}
                            className="px-4 py-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/30 transition"
                          >
                            View
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-6 text-center text-white/60">
                      No recent requests available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProvider_Dashboard;