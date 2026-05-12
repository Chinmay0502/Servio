import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";

const Verify = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const [status, setStatus] = useState("Verifying email...");

  const verifyEmail = async () => {
    try {
      const res = await api.get(`/auth/user/verify/${token}`);

      if (res.data.success) {
        setStatus("✅ Email verified successfully!");

        toast.success("Email verified!");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setStatus("❌ Invalid or expired token");
      }
    } catch (error) {
      console.log(error);
      setStatus("⚠️ Verification failed");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/register");
      return;
    }

    verifyEmail();
  }, [token]);

  return (
    <div className="flex items-center justify-center h-screen text-white">
      <h2>{status}</h2>
    </div>
  );
};

export default Verify;