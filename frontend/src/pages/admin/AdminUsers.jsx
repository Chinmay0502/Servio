import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserX, UserCheck, ShieldAlert } from "lucide-react";
import api from "../../api/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/admin/get-all-users", {
        withCredentials: true,
      });
      setUsers(res.data.users);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (id) => {
    try {
      await api.get(`/admin/user-status/${id}`, {
        withCredentials: true,
      });
      toast.success("User status updated successfully");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user status");
    }
  };

  return (
    <div className="w-full border border-white/10 rounded-2xl p-6 mb-6 bg-gradient-to-br from-[#0d0d1a] via-[#12122a] to-[#0d0d1a] shadow-xl">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Manage Users</h2>
          <p className="text-gray-400 text-sm mt-1">View all users and update their access status.</p>
        </div>
        <div className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300">
          Total Users: <span className="text-white font-semibold">{users.length}</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 custom-scroll">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-gray-300 text-sm uppercase tracking-wider border-b border-white/10">
              <th className="p-4 font-semibold">User</th>
              <th className="p-4 font-semibold">Contact</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.length === 0 && !isLoading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={user.image?.url || "/Profile_Image.jpg"} 
                        alt={user.name} 
                        className="w-10 h-10 rounded-full object-cover border border-white/20"
                      />
                      <div>
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.gender}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-gray-300">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{user.phone}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-semibold ${user.role === 'SERVICE_PROVIDER' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>
                      {user.role === 'SERVICE_PROVIDER' ? 'Provider' : 'Consumer'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-semibold flex items-center gap-1 w-max ${user.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                      {user.status === 'ACTIVE' ? <UserCheck size={12}/> : <ShieldAlert size={12}/>}
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => toggleUserStatus(user._id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${user.status === 'ACTIVE' ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20'}`}
                    >
                      {user.status === 'ACTIVE' ? 'Block User' : 'Unblock User'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Custom Scrollbar for table overflow */}
      <style>
        {`
          .custom-scroll::-webkit-scrollbar {
            height: 6px;
          }
          .custom-scroll::-webkit-scrollbar-thumb {
            background: rgba(168, 85, 247, 0.4);
            border-radius: 10px;
          }
          .custom-scroll::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
          }
        `}
      </style>
    </div>
  );
};

export default AdminUsers;
