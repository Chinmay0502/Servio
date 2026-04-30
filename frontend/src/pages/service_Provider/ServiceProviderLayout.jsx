import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const ServiceProviderLayout = () => {
  const linkClass = ({ isActive }) =>
    `px-4 py-3 rounded-xl transition text-sm font-medium flex items-center gap-2
    ${
      isActive
        ? "bg-highlight/20 border border-highlight/40 text-highlight"
        : "hover:bg-white/5 text-white/80"
    }`;

  return (
    <div className="min-h-screen text-white flex px-8 mt-5">
      {/* Sidebar */}
      <aside className="w-[260px] bg-[#0f0f24] border border-white/10 p-6 hidden md:block rounded-xl">
        <h2 className="text-2xl font-bold mb-10 tracking-wide text-highlight">
          Provider Panel
        </h2>

        <nav className="flex flex-col gap-4">
          <NavLink to="/serviceProvider/dashboard" className={linkClass}>
            📊 Dashboard
          </NavLink>

          <NavLink to="/serviceProvider/requests" className={linkClass}>
            📩 Service Requests
          </NavLink>

          <NavLink to="/serviceProvider/services" className={linkClass}>
            🛠 My Services
          </NavLink>

          <NavLink to="/serviceProvider/add-service" className={linkClass}>
            ➕ Add New Service
          </NavLink>

          {/* ✅ NEW LINK */}
          <NavLink to="/serviceProvider/add-worker" className={linkClass}>
            👷 Add Worker
          </NavLink>

          <NavLink to="/serviceProvider/history" className={linkClass}>
            📜 Booking History
          </NavLink>

          <NavLink to="/serviceProvider/profile" className={linkClass}>
            👤 My Profile
          </NavLink>

          <NavLink
            to="/"
            className="px-4 py-3 rounded-xl hover:bg-red-600/20 transition text-red-400"
          >
            🚪 Logout
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default ServiceProviderLayout;