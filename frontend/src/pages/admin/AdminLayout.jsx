import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Tags, LogOut } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/admin/logout", {}, { withCredentials: true });
      toast.success("Admin logged out");
      navigate("/admin/login");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#010314] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[rgba(20,22,35,0.55)] border-r border-white/10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold text-highlight tracking-wide">Servio Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink 
            to="/admin/dashboard" 
            end
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-highlight text-white' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
          >
            <LayoutDashboard size={20} />
            <span className="font-semibold">Requests</span>
          </NavLink>
          <NavLink 
            to="/admin/users" 
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-highlight text-white' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
          >
            <Users size={20} />
            <span className="font-semibold">Users</span>
          </NavLink>
          <NavLink 
            to="/admin/categories" 
            className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-highlight text-white' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
          >
            <Tags size={20} />
            <span className="font-semibold">Categories</span>
          </NavLink>
        </nav>
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-primary/70 hover:bg-primary transition-all font-semibold"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
