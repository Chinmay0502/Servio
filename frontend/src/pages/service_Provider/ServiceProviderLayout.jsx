import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

const ServiceProviderLayout = () => {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-4 py-3 rounded-xl transition text-sm font-medium flex items-center gap-2
    ${
      isActive
        ? "bg-highlight/20 border border-highlight/40 text-highlight"
        : "hover:bg-white/5 text-white/80"
    }`;

  const mobileLink =
    "flex flex-col items-center justify-center text-xs py-2 text-white/70 hover:text-white";

  const handleLogout = () => {
    // clear token or call API if needed
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen text-white flex flex-col md:flex-row lg:px-10 md:px-6">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="w-[260px] bg-[#0f0f24] border border-white/10 p-6 hidden md:block rounded-xl m-4">
        <h2 className="text-2xl font-bold mb-10 tracking-wide text-highlight">
          Provider Panel
        </h2>

        <nav className="flex flex-col gap-4">
          <NavLink to="/serviceProvider/dashboard" className={linkClass}>
            📊 Dashboard
          </NavLink>

          <NavLink to="/serviceProvider/requests" className={linkClass}>
            📩 Requests
          </NavLink>

          <NavLink to="/serviceProvider/myservices" className={linkClass}>
            🛠 My Services
          </NavLink>

          <NavLink to="/serviceProvider/add-service" className={linkClass}>
            ➕ Add Service
          </NavLink>

          <NavLink to="/serviceProvider/add-worker" className={linkClass}>
            👷 Add Worker
          </NavLink>

          <NavLink to="/serviceProvider/reviews" className={linkClass}>
            ⭐ Reviews
          </NavLink>

          <button
            onClick={handleLogout}
            className="px-4 py-3 rounded-xl hover:bg-red-600/20 transition text-red-400 text-left"
          >
            🚪 Logout
          </button>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-4 md:p-10 pb-20 md:pb-10">
        <Outlet />
      </main>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0f0f24] border-t border-white/10 md:hidden flex justify-around py-2 z-50">

        <NavLink to="/serviceProvider/dashboard" className={mobileLink}>
          📊<span>Home</span>
        </NavLink>

        <NavLink to="/serviceProvider/requests" className={mobileLink}>
          📩<span>Requests</span>
        </NavLink>

        <NavLink to="/serviceProvider/myservices" className={mobileLink}>
          🛠<span>Services</span>
        </NavLink>

        <NavLink to="/serviceProvider/add-service" className={mobileLink}>
          ➕<span>Add</span>
        </NavLink>

        <button onClick={handleLogout} className={mobileLink}>
          🚪<span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default ServiceProviderLayout;