import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Bounce, ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import axios from "axios";

import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Navbar from "./components/Navbar";
import Services from "./pages/Services";
import AdminLogin from "./pages/admin/AdminLogin";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import LogoLoader from "./components/LogoLoader";
import privateAxios from "./api/privateAxios";
import Admin_Dashboard from "./pages/admin/Admin_Dashboard";
import ServiceProvider_Dashboard from "./pages/service_Provider/ServiceProvider_Dashboard";
import ServiceRequest from "./components/ServiceRequest";
import UpdateProfile from "./pages/UpdateProfile";

import {
  login,
  logout,
  setLoading as setAuthLoading,
} from "./redux/slices/userSlice";
import Footer from "./components/Footer";
import Verify from "./components/Verify";
import ServiceProviderLayout from "./pages/service_Provider/ServiceProviderLayout";
import ServiceRequests from "./pages/service_Provider/ServiceRequests";
import AddService from "./pages/service_Provider/AddService";

const App = () => {
  const dispatch = useDispatch();

  const [location, setLocation] = useState();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;

      try {
        const location = await axios.get(url);
        setLocation(location.data.address);
        setOpenDropdown(false);
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    const reqInterceptor = privateAxios.interceptors.request.use(
      (config) => {
        setLoading(true);
        return config;
      },
      (error) => Promise.reject(error),
    );

    const resInterceptor = privateAxios.interceptors.response.use(
      (response) => {
        setLoading(false);
        return response;
      },
      (error) => {
        setLoading(false);
        return Promise.reject(error);
      },
    );
    return () => {
      privateAxios.interceptors.request.eject(reqInterceptor);
      privateAxios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  // GET PROFILE ON LOAD
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await privateAxios.get("/auth/user/get-profile", {
          withCredentials: true,
        });

        console.log(res.data.user);
        dispatch(login(res.data?.user));
      } catch (err) {
        dispatch(logout());
      } finally {
        dispatch(setAuthLoading(false));
      }
    };

    fetchProfile();
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        theme="dark"
        transition={Bounce}
      />

      <Navbar
        location={location}
        getLocation={getLocation}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
      />

      <LogoLoader show={loading} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/adminDashboard" element={<Admin_Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />

        <Route path="/serviceRequest" element={<ServiceRequest />} />

        <Route path="/profile">
          <Route index element={<Profile />} />
          <Route path="update" element={<UpdateProfile />} />
        </Route>

        <Route path="/verify-email" element={<Verify />} />

        <Route path="/serviceProvider" element={<ServiceProviderLayout />}>
          <Route path="dashboard" element={<ServiceProvider_Dashboard />} />
          <Route path="requests" element={<ServiceRequests />} />
          <Route path="add-service" element={<AddService />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
