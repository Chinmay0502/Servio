import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const WorkerLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Worker Login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return toast.error("Email and password are required!");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/api/worker/login",
        formData,
        {
          withCredentials: true,
        }
      );

      toast.success(res.data.message || "Login successful!");

      // ✅ Store worker info and token
      localStorage.setItem("workerToken", res.data.token);
      localStorage.setItem("workerData", JSON.stringify(res.data.worker));

      navigate("/worker/dashboard");
    } catch (error) {
      console.log(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-[#050511] via-[#0b0b22] to-[#120033]">
      <div className="w-full max-w-md bg-[#11112a] border border-white/10 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          Worker Login
        </h1>

        <p className="text-white/60 text-sm text-center mb-6">
          Login to access your assigned tasks
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm text-white/70">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-purple-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-white/70">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm outline-none focus:border-purple-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Extra */}
        <div className="mt-6 text-center text-sm text-white/60">
          Are you a Service Provider?{" "}
          <Link to="/login" className="text-purple-400 hover:underline">
            Provider Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkerLogin;