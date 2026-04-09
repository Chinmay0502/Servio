import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const ServiceProvider_Dashboard = () => {
  const user = useSelector((state) => state.user.value);

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
              <h2 className="font-bold text-lg">{user?.name || "Provider Name"}</h2>
              <p className="text-sm text-white/60">
                {user?.serviceCategory || user?.role || "Service Provider"}
              </p>
            </div>
          </div>

          <div className="mt-5 text-sm text-white/70 space-y-2">
            <p>📍 {user?.city || user?.address || "Bhubaneswar, India"}</p>
            <p>📞 {user?.phone || "Not Available"}</p>
            <p>📧 {user?.email || "Not Available"}</p>
            <p>⭐ Rating: {user?.rating || "4.8"} / 5</p>
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
            <h2 className="text-2xl font-bold mt-2">
              {user?.totalRequests || 0}
            </h2>
          </div>

          <div className="bg-[#11112a] border border-white/10 rounded-2xl p-6 shadow-md">
            <p className="text-white/60 text-sm">Completed</p>
            <h2 className="text-2xl font-bold mt-2 text-green-400">
              {user?.completedRequests || 0}
            </h2>
          </div>

          <div className="bg-[#11112a] border border-white/10 rounded-2xl p-6 shadow-md">
            <p className="text-white/60 text-sm">Pending</p>
            <h2 className="text-2xl font-bold mt-2 text-yellow-400">
              {user?.pendingRequests || 0}
            </h2>
          </div>

          <div className="bg-[#11112a] border border-white/10 rounded-2xl p-6 shadow-md">
            <p className="text-white/60 text-sm">Earnings</p>
            <h2 className="text-2xl font-bold mt-2 text-purple-400">
              ₹ {user?.earnings || 0}
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

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-white/60 border-b border-white/10">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Service</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {(user?.recentRequests && user.recentRequests.length > 0) ? (
                user.recentRequests.map((req, index) => (
                  <tr
                    key={index}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="py-4">{req.customerName}</td>
                    <td className="py-4">{req.service}</td>
                    <td className="py-4">{req.location}</td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          req.status === "Pending"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : req.status === "Completed"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 text-right flex gap-2 justify-end">
                      {req.status === "Pending" ? (
                        <>
                          <button className="px-4 py-2 rounded-xl bg-green-600/20 text-green-400 border border-green-500/30 hover:bg-green-600/30 transition">
                            Accept
                          </button>
                          <button className="px-4 py-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 transition">
                            Reject
                          </button>
                        </>
                      ) : (
                        <button className="px-4 py-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/30 transition">
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-white/60">
                    No recent requests available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServiceProvider_Dashboard;