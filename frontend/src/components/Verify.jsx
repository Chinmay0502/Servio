import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Verify = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Waiting for verification...");

  const email = sessionStorage.getItem("verifyEmail");

  const checkVerification = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/user/check-verification",
        { email }
      );

      if (res.data.success && res.data.isVerified === true) {
        setStatus("✅ Email verified! Redirecting to login...");
        toast.success("✅ Email verified successfully!");

        setTimeout(() => {
          sessionStorage.removeItem("verifyEmail");
          navigate("/login");
        }, 1500);
      } else {
        setStatus("📩 Verification pending. Please check your inbox.");
      }
    } catch (error) {
      setStatus("⚠️ Server error. Please refresh.");
    }
  };

  useEffect(() => {
    if (!email) {
      navigate("/register");
      return;
    }

    checkVerification();

    const interval = setInterval(() => {
      checkVerification();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a12] relative overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(108,59,232,.25), transparent 50%), radial-gradient(circle at 80% 30%, rgba(232,24,92,.18), transparent 55%), radial-gradient(circle at 50% 80%, rgba(14,165,233,.12), transparent 60%), #0a0a12",
      }}
    >
      {/* Glow Blur Orbs */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-pink/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-purple-500/20 blur-[120px] rounded-full"></div>

      {/* Card */}
      <div className="relative z-10 max-w-lg w-full bg-[#12121f]/70 backdrop-blur-xl border border-[#6c3be8]/30 rounded-3xl p-10 text-center shadow-xl shadow-[#6c3be8]/10">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-2xl border border-pink/30 bg-pink/10 text-3xl">
          ✉️
        </div>

        <p className="font-mono text-[.7rem] tracking-[.25em] text-pink uppercase mb-3">
          Email Verification
        </p>

        <h2 className="font-syne font-extrabold text-white leading-tight mb-4 text-3xl">
          Check your inbox
        </h2>

        <p className="text-gray-400 text-sm leading-relaxed mb-6">
          We sent a verification link to your registered email address.
          <br />
          Please open your inbox and click the link to activate your account.
        </p>

        {/* Email Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-200 mb-6">
          <span className="w-2 h-2 rounded-full bg-pink animate-pulse"></span>
          {email}
        </div>

        {/* Status Box */}
        <div className="bg-[#0d0d1a] border border-[#6c3be8]/25 rounded-2xl px-5 py-4 text-sm text-gray-300">
          {status}
        </div>

        <p className="mt-6 text-xs text-gray-500">
          This page will automatically redirect once your email is verified.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={checkVerification}
            className="bg-pink text-white px-8 py-3 rounded-xl font-bold text-sm hover:-translate-y-1 transition-transform"
            style={{ boxShadow: "0 0 30px rgba(232,24,92,.35)" }}
          >
            I Verified My Email
          </button>

          <button
            onClick={() => navigate("/register")}
            className="border border-white/20 text-white px-8 py-3 rounded-xl font-bold text-sm hover:border-purp-light hover:text-purp-light transition-colors"
          >
            Change Email
          </button>
        </div>
      </div>
    </section>
  );
};

export default Verify;