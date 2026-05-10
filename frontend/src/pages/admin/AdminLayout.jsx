import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, Tags, LogOut } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/admin/logout",
        {},
        { withCredentials: true }
      );
      toast.success("Admin logged out");
      navigate("/admin/login");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold
    ${
      isActive
        ? "bg-highlight text-white"
        : "hover:bg-white/5 text-gray-400 hover:text-white"
    }`;

  const mobileLink =
    "flex flex-col items-center justify-center text-[11px] text-gray-400 hover:text-white";

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#010314] text-white">

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="w-64 bg-[rgba(20,22,35,0.55)] border-r border-white/10 hidden md:flex flex-col">

        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-highlight">
            Servio Admin
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">

          <NavLink to="/admin/dashboard" end className={linkClass}>
            <LayoutDashboard size={20} />
            Requests
          </NavLink>

          <NavLink to="/admin/users" className={linkClass}>
            <Users size={20} />
            Users
          </NavLink>

          <NavLink to="/admin/categories" className={linkClass}>
            <Tags size={20} />
            Categories
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-primary/70 hover:bg-primary transition font-semibold mt-6"
          >
            <LogOut size={18} /> Logout
          </button>
        </nav>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-y-auto">
        <Outlet />
      </main>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0b0d1a] border-t border-white/10 flex justify-around py-2 z-50">

        <NavLink to="/admin/dashboard" className={mobileLink}>
          <LayoutDashboard size={18} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/admin/users" className={mobileLink}>
          <Users size={18} />
          <span>Users</span>
        </NavLink>

        <NavLink to="/admin/categories" className={mobileLink}>
          <Tags size={18} />
          <span>Categories</span>
        </NavLink>

        <button onClick={handleLogout} className={mobileLink}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>

      </div>
    </div>
  );
};

export default AdminLayout;