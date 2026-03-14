import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import axios from "axios";
import Services from "./pages/Services";
import AdminLogin from "./pages/admin/AdminLogin"
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import LogoLoader from "./components/LogoLoader";
import privateAxios from "./api/privateAxios";
import Admin_Dashboard from "./pages/admin/Admin_Dashboard";
import ServiceProvider_Dashboard from "./pages/service_Provider/ServiceProvider_Dashboard";
import UserRoleChange from "./components/userRoleChange";

const App = () => {
  const [location, setLocation] = useState();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const getLocation = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      console.log(latitude, longitude);

      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

      try {
        const location = await axios.get(url);
        // console.log(location);
        const address = location.data.address;
        // console.log(address);
        setLocation(address);
        setOpenDropdown(false);
      } catch (error) {
        console.log(error);
      }
    });
  };
  useEffect(() => {
    toast.success("Hi toast is working");
    getLocation();
  }, []);
  useEffect(()=>{
    //Request Interseptor
    privateAxios.interceptors.request.use((config)=>{
      setLoading(true);
      return config;
    },(error)=>{
      return Promise.reject(error);
    });
    //Response Interseptor
    privateAxios.interceptors.response.use((config)=>{
      setLoading(false);
      return config;
    },(error)=>{
      return Promise.reject(error);
    });
  },[])

  return (
    <BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      <Navbar
        location={location}
        getLocation={getLocation}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
      />
      <LogoLoader show={loading}/>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/admin/login" element={<AdminLogin/>}></Route>
        <Route path="/admin/adminDashboard" element={<Admin_Dashboard/>}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/services" element={<Services />}></Route>
        <Route path="/serviceProvider" element={<ServiceProvider_Dashboard/>}></Route>
        <Route path="/userRoleChange" element={<UserRoleChange/>}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
