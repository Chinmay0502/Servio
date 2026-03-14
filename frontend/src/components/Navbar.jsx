import React, { useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { FaCaretDown } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CgClose } from "react-icons/cg";
import { HiMenuAlt3 } from "react-icons/hi";
import { HiMenuAlt1 } from "react-icons/hi";
import SideBar from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/userSlice";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = ({ location, getLocation, openDropdown, setOpenDropdown }) => {
  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };
  const [openNav, setOpenNav] = useState(false);
  const user = useSelector((state) => state.user.value);

  return (
    <div className="px-3 py-2">
      <div className="border border-blur-[14px] bg-[rgba(20,22,35,0.55)] border-white/20 py-2 rounded-full md:border-0 md:bg-[#010314] w-full px-10 sticky left-0 right-0 md:py-0 text-white flex justify-between mt-3">
        {/* Logo Section */}
        <div className="flex justify-center items-center gap-5">
          <NavLink
            to={"/"}
            className="font-[Roobert] text-2xl flex justify-center items-center gap-3"
          >
            <img src="/Final_Logo.png" alt="Servio" className="w-[1.5rem]" />
            Servio
          </NavLink>
          <div className="md:flex hidden justify-center items-center gap-1 text-sm">
            <MapPin className="text-white" />
            <span className="font-semibold -space-y-2">
              {location ? (
                <div>
                  <p className="font-[Roobert]">
                    {location.state_district}
                    <span className="ms-1">{location.state}</span>
                  </p>
                </div>
              ) : (
                <div>Add Address</div>
              )}
            </span>
            <FaCaretDown className="cursor-pointer" onClick={toggleDropdown} />
          </div>
          {openDropdown ? (
            <div className="w-[15rem] font-[Roobert] shadow-2xl h-max z-50 fixed top-20 left-30 p-5 bg-[rgba(20,22,35,0.55)] backdrop-blur-[14px] border border-white/10 rounded-md">
              <h2 className="font-semibold mb-4 text-md flex justify-between font-[Roobert]">
                Change Location
                <span onClick={toggleDropdown}>
                  <div className="bg-primary p-1 rounded-full cursor-pointer hover:bhighlight">
                    <CgClose />
                  </div>
                </span>
              </h2>
              <button
                onClick={getLocation}
                className="bg-primary font-[Roobert] text-sm rounded-md px-3 py-1 hover:bg-primary cursor-pointer"
              >
                Detect My Location
              </button>
            </div>
          ) : null}
        </div>
        {/* Menu Chart */}
        <div className="flex justify-center items-center">
          <nav className="lg:flex hidden px-5 py-2 text-sm rounded-full font-[Roobert] bg-[rgba(20,22,35,0.55)] backdrop-blur-[14px] border border-white/10 rounded-full">
            <ul className="flex gap-5">
              <NavLink
                to={"/"}
                className={({ isActive }) =>
                  `${isActive ? "border-b-4 border-highlight transition-all" : "text-white"}cursor-pointer`
                }
              >
                Home
              </NavLink>
              <NavLink
                to={"/services"}
                className={({ isActive }) =>
                  `${isActive ? "border-b-4 border-highlight transition-all" : "text-white"} cursor-pointer`
                }
              >
                All Services
              </NavLink>
              <NavLink
                to={"contact"}
                className={({ isActive }) =>
                  `${isActive ? "border-b-4 border-highlight transition-all" : "text-white"} cursor-pointer`
                }
              >
                Contact Us
              </NavLink>
              <NavLink
                to={"/about"}
                className={({ isActive }) =>
                  `${isActive ? "border-b-4 border-highlight transition-all" : "text-white"} cursor-pointer`
                }
              >
                About Us
              </NavLink>
            </ul>
          </nav>
        </div>
        <div className="flex justify-center items-center gap-2">
          <div className="md:flex hidden border border-blur-[14px] border-white/10 px-2 py-2.5 rounded-md bg-highlight hover:bg-primary cursor-pointer">
            <FaSearch />
          </div>
          <input
            type="text"
            className="md:flex hidden text-white text-sm bg-[rgba(20,22,35,0.55)] backdrop-blur-[14px] border border-white/10 rounded-md  px-2 py-2 w-[8rem]"
            placeholder="Services"
          />
        {/* Login and logout Section */}
          {user ? (
            <Link to={"/profile"}>
              <button className="hidden lg:inline bg-primary md:bg-[#010314] md:hover:bg-primary px-4 py-2 font-[Roobert] cursor-pointer text-sm rounded-md text-white font-semibold">
                profile
              </button> 
            </Link>
          ) : (
            <Link to={"/login"}>
              <button className="hidden lg:inline bg-primary md:bg-[#010314] md:hover:bg-primary px-4 py-2 font-[Roobert] cursor-pointer text-sm rounded-md text-white font-semibold">
                Login
              </button>
            </Link>
          )}
          {openNav ? (
            <HiMenuAlt3
              onClick={() => setOpenNav(false)}
              className="h-6 w-7 lg:hidden"
            />
          ) : (
            <HiMenuAlt1
              onClick={() => setOpenNav(true)}
              className="h-6 w-7 lg:hidden"
            />
          )}
        </div>
      </div>
      <SideBar openNav={openNav} setOpenNav={setOpenNav} />
    </div>
  );
};

export default Navbar;
