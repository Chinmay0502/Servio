import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../../redux/slices/userSlice";
const Profile_Header = () => {
  const user = useSelector((state) => state.user.value);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogout() {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await axios.get(
        "http://localhost:8000/api/auth/user/logout",
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

  return (
    <div className="rounded-2xl shadow-xl transition-all border border-blur-[14px] bg-[rgba(20,22,35,0.55)] border-white/20 p-5 mt-5 flex flex-col items-center gap-5 h-[35rem]  justify-center">
      <div className=" flex flex-col items-center">
        <img
          src="/Profile_Image.jpg"
          className=" w-[8rem] lg:w-[8rem] rounded-full"
        />
        <div className="mt-3 flex flex-col p-2 justify-center text-center">
          {user ? (
            <h2>
              <span className="font-bold">Name- </span>
              {user.name}
            </h2>
          ) : (
            <h2>
              <span className="font-bold">Name- </span>
            </h2>
          )}
          {user ? (
            <p>
              <span className="font-bold">Role- </span>
              {user.role}
            </p>
          ) : (
            <p>
              <span className="font-bold">Role- </span>
            </p>
          )}
          <button className="bg-highlight rounded-md mt-5 px-2 py-1 font-semibold cursor-pointer">
            Edit
          </button>
        </div>
      </div>
      <div className="bg-primary p-3 rounded-xl shadow-sm shadow-highlight">
        <ul className="">
          <li className="flex gap-1">
            Gender- <spna> {user ? user.gender : ""}</spna>
          </li>
          <li className="flex gap-1">
            <span>Mobile-</span> {user ? user.phone : ""}
          </li>
          <li className="flex gap-1">
            <span>Aadhaar-</span> 545068897125
          </li>
          <li className="flex gap-1">
            <span>Email-</span> {user ? user.email : ""}
          </li>
          <li className="flex gap-1">
            <span>Status-</span> {user ? user.status : ""}
          </li>
        </ul>
      </div>
      {user && (
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full bg-primary px-4 py-2 font-[Roobert] cursor-pointer text-sm rounded-md font-semibold flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader2 className="animate-spin size-6" /> : "Logout"}
        </button>
      )}
      {user.role === "CONSUMER" ? (
        <Link
          to="/userRoleChange"
          className="w-full text-center bg-highlight px-2 py-1 rounded-md font-semibold cursor-pointer"
        >
          Give Services
        </Link>
      ) : (
        <Link
          to="/serviceProvider"
          className="w-full text-center bg-highlight px-2 py-1 rounded-md font-semibold cursor-pointer"
        >
          My Services
        </Link>
      )}
    </div>
  );
};

export default Profile_Header;
