import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOffIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../api/api";
/* schema unchanged */
const SigninSchema = z
  .object({
    name: z.string().min(3),
    email: z.string().email(),
    phone: z
      .string()
      .min(10)
      .max(10)
      .regex(/^[6-9]\d{9}$/),
    aadhaarNo: z
      .string()
      .length(12)
      .regex(/^[2-9]{1}[0-9]{11}$/),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(SigninSchema), mode: "onTouched" });

  async function submit(formData) {
    if (isLoading) return;

    const { confirmPassword, ...data } = formData;

    setIsLoading(true);
    try {
      const res = await api.post("/auth/user/register", data);

      toast.success(res.data.message || "User created successfully");
      sessionStorage.setItem("verifyEmail", res.data.user.email);
      reset();
      navigate("/verify-email");
    } catch (error) {
      console.log("Register Error:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Registration failed",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 md:px-0">
      <div
        className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl
        mt-10 mb-10 p-4 sm:p-6
        bg-[rgba(20,22,35,0.55)] border border-white/20
        rounded-2xl shadow-xl shadow-primary"
      >
        {/* HEADER */}
        <div className="flex flex-col items-center mb-6">
          <img src="/Final_Logo.png" className="w-10" />
          <h2 className="text-lg font-semibold text-highlight">
            Welcome To Servio
          </h2>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          {/* NAME */}
          <div>
            <label className="text-sm font-semibold">Full Name</label>
            <input
              {...register("name")}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-[rgba(20,22,35,0.55)] border border-white/20"
            />
            {errors.name && (
              <p className="text-xs text-red-300">{errors.name.message}</p>
            )}
          </div>

          {/* GENDER (FIXED RESPONSIVE) */}
          <div>
            <label className="text-sm font-semibold">Gender</label>

            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              {["MALE", "FEMALE", "OTHER"].map((g) => (
                <label key={g} className="cursor-pointer w-full">
                  <input
                    type="radio"
                    value={g}
                    {...register("gender")}
                    className="hidden peer"
                  />
                  <div
                    className="text-center px-4 py-2 rounded-xl border border-white/20 bg-[rgba(20,22,35,0.55)]
                    peer-checked:bg-primary peer-checked:text-white transition"
                  >
                    {g}
                  </div>
                </label>
              ))}
            </div>

            {errors.gender && (
              <p className="text-xs text-red-300">{errors.gender.message}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-semibold">Email</label>
            <input
              {...register("email")}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-[rgba(20,22,35,0.55)] border border-white/20"
            />
            {errors.email && (
              <p className="text-xs text-red-300">{errors.email.message}</p>
            )}
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm font-semibold">Mobile No.</label>
            <input
              {...register("phone")}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-[rgba(20,22,35,0.55)] border border-white/20"
            />
            {errors.phone && (
              <p className="text-xs text-red-300">{errors.phone.message}</p>
            )}
          </div>

          {/* AADHAAR */}
          <div>
            <label className="text-sm font-semibold">Aadhaar No.</label>
            <input
              {...register("aadhaarNo")}
              className="w-full mt-1 px-3 py-2 rounded-xl bg-[rgba(20,22,35,0.55)] border border-white/20"
            />
            {errors.aadhaarNo && (
              <p className="text-xs text-red-300">{errors.aadhaarNo.message}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-sm font-semibold">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-[rgba(20,22,35,0.55)] border border-white/20 pr-10"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer"
              >
                {showPassword ? <Eye /> : <EyeOffIcon />}
              </span>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm font-semibold">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className="w-full mt-1 px-3 py-2 rounded-xl bg-[rgba(20,22,35,0.55)] border border-white/20 pr-10"
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 cursor-pointer"
              >
                {showConfirmPassword ? <Eye /> : <EyeOffIcon />}
              </span>
            </div>
          </div>

          {/* BUTTON */}
          <button
            disabled={isLoading}
            className="w-full bg-primary py-2 rounded-xl font-semibold flex justify-center"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Register"}
          </button>

          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-highlight">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signin;
