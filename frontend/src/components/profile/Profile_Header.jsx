import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../../redux/slices/userSlice";
import LogoLoader from "../LogoLoader";
import api from "../../api/api"

const Profile_Header = () => {
  const user = useSelector((state) => state.user.value);
  const loading = useSelector((state) => state.user.loading);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogout() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await api.get(
        "/auth/user/logout",
        { withCredentials: true },
      );
      dispatch(logout());
      toast.success(res.data.message || "User logged out successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Error logging out user");
    } finally {
      setIsLoading(false);
    }
  }

  if(loading) return (<LogoLoader show={loading} />)

  return (
    <div className="rounded-2xl shadow-xl transition-all border border-white/20 bg-[rgba(20,22,35,0.55)] backdrop-blur-md p-6 lg:w-[20rem] lg:min-h-[35rem] flex flex-col justify-between mt-5">
      <div>
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={user?.image || "/Profile_Image.jpg"}
              className="h-32 w-32 rounded-full object-cover border-4 border-highlight shadow-lg shadow-highlight/20"
              alt="Profile"
            />
            {user?.role === "SERVICE_PROVIDER" && (
              <span className="absolute bottom-0 right-2 bg-purple-500 text-white text-[0.65rem] font-bold px-2 py-1 rounded-full border-2 border-[#141623]">
                PRO
              </span>
            )}
          </div>
          <div className="mt-4 flex flex-col items-center text-center w-full">
            <h2 className="text-2xl font-bold text-white tracking-wide">
              {user?.name || "Guest User"}
            </h2>
            <p className="text-sm font-semibold text-highlight tracking-widest uppercase mt-1">
              {user?.role || "GUEST"}
            </p>
            
            <div className="flex gap-3 justify-center w-full mt-5">
              <Link to="/profile/update" className="flex-1 text-center bg-highlight hover:bg-primary transition-all rounded-lg px-4 py-2 text-sm font-bold shadow-md shadow-highlight/20">
                Edit Profile
              </Link>
              <Link to="/profile/addresses" className="flex-1 text-center bg-white/5 border border-white/20 hover:bg-white/10 transition-all rounded-lg px-4 py-2 text-sm font-bold">
                Addresses
              </Link>
            </div>
          </div>
        </div>

        {/* User Details Section */}
        <div className="mt-8 bg-black/20 p-4 rounded-xl border border-white/10">
          <h3 className="text-xs uppercase tracking-widest text-gray-400 font-mono mb-4">Contact Information</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-gray-400">Gender</span>
              <span className="font-semibold text-white">{user?.gender || "N/A"}</span>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-gray-400">Mobile</span>
              <span className="font-semibold text-white">{user?.phone || "N/A"}</span>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-gray-400">Aadhaar</span>
              <span className="font-semibold text-white">{user?.aadhaarNo || "N/A"}</span>
            </li>
            <li className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-gray-400">Email</span>
              <span className="font-semibold text-white truncate max-w-[150px]" title={user?.email}>{user?.email || "N/A"}</span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-gray-400">Status</span>
              <span className={`font-semibold px-2 py-0.5 rounded-md text-xs ${user?.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {user?.status || "UNKNOWN"}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 space-y-3">
        <Link
          to="/my-bookings"
          className="block w-full text-center bg-white/5 border border-white/20 hover:bg-primary transition-all px-4 py-2.5 rounded-lg font-bold"
        >
          My Bookings
        </Link>
        
        {user?.role === "CONSUMER" ? (
          <Link
            to="/serviceRequest"
            className="block w-full text-center border border-highlight text-highlight hover:bg-highlight hover:text-white transition-all px-4 py-2.5 rounded-lg font-bold shadow-lg"
          >
            Become a Provider
          </Link>
        ) : user?.role === "SERVICE_PROVIDER" ? (
          <Link
            to="/serviceProvider/dashboard"
            className="block w-full text-center border border-highlight text-highlight hover:bg-highlight hover:text-white transition-all px-4 py-2.5 rounded-lg font-bold shadow-lg"
          >
            Provider Dashboard
          </Link>
        ) : null}
        
        {user && (
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full bg-highlight/50 hover:bg-highlight text-white border border-red-500/30 transition-all px-4 py-2.5 rounded-lg font-bold flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin size-5" /> : "Logout"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile_Header;