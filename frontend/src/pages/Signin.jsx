import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOffIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const SigninSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters"),

    email: z
      .string()
      .email("Enter a valid email"),

    phone: z
      .string()
      .min(10, "Phone number must be 10 digits")
      .max(10, "Phone number must be 10 digits")
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),

    aadhaarNo: z
      .string()
      .length(12, "Aadhaar must be 12 digits")
      .regex(/^[2-9]{1}[0-9]{11}$/, "Enter a valid Aadhaar number"),

    gender: z.enum(["MALE", "FEMALE", "OTHER"], "Please select a gender"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Must contain one uppercase letter")
      .regex(/[0-9]/, "Must contain one number"),

    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // error will show under confirmPassword field
  });

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(SigninSchema), mode: "onTouched" });
  async function submit(formData) {
    if (isLoading) return;
    const { confirmPassword, ...data } = formData;
    console.log(data);
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/user/register",
        data,
      );
      toast.success(res.data.message || "User created successfully");
      reset();
      navigate("/services");
    } catch (error) {
      console.error(error);
      toast.error("Error creating user");
    } finally {
      setIsLoading(false);
    }

  }
  return (
    <div className="rounded-br-2xl rounded-tr-2xl shadow-xl shadow-primary transition-all border border-blur-[14px] bg-[rgba(20,22,35,0.55)] border-white/20 rounded-xl w-full max-w-4/5 md:max-w-2/4 lg:max-w-1/3 p-5 mx-auto mt-20 lg:mt-4 mb-8">
      <div className="mx-auto px-2 py-1 rounded-full flex flex-col justify-center items-center">
        <img src="/Final_Logo.png" className="w-8" />
        <h2 className="text-lg font-semibold text-center text-highlight w-full">
          Welcome To Servio
        </h2>
      </div>
      <form
        className="mt-5 flex gap-3 flex-col"
        onSubmit={handleSubmit(submit)}
      >
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm">Full Name</label>
          <input
            type="text"
            placeholder="Enter name here"
            className={`border ${errors.name ? "border-red-300 focus:ring-2 focus:ring-red-300" : " border-blur-[14px] border-white/20"} bg-[rgba(20,22,35,0.55)]   rounded-xl py-1 pl-2`}
            {...register("name")}
          />
          {errors.name && <p className="text-sm text-red-300">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-sm">Gender</label>

          <div className="flex justify-between px-20">

            <label className="cursor-pointer">
              <input
                type="radio"
                value="MALE"
                {...register("gender")}
                className="hidden peer"
              />
              <div className="px-5 py-2 rounded-xl border border-white/20 bg-[rgba(20,22,35,0.55)]
      peer-checked:bg-primary peer-checked:text-white
      hover:border-primary transition-all">
                Male
              </div>
            </label>

            <label className="cursor-pointer">
              <input
                type="radio"
                value="FEMALE"
                {...register("gender")}
                className="hidden peer"
              />
              <div className="px-5 py-2 rounded-xl border border-white/20 bg-[rgba(20,22,35,0.55)]
      peer-checked:bg-primary peer-checked:text-white
      hover:border-primary transition-all">
                Female
              </div>
            </label>

            <label className="cursor-pointer">
              <input
                type="radio"
                value="OTHER"
                {...register("gender")}
                className="hidden peer"
              />
              <div className="px-5 py-2 rounded-xl border border-white/20 bg-[rgba(20,22,35,0.55)]
      peer-checked:bg-primary peer-checked:text-white
      hover:border-primary transition-all">
                Other
              </div>
            </label>

          </div>

          {errors.gender && (
            <p className="text-sm text-red-300">{errors.gender.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm">Email</label>
          <input
            type="email"
            placeholder="Enter email here"
            className={`border ${errors.email ? "border-red-300 focus:ring-2 focus:ring-red-300" : " border-blur-[14px] border-white/20"} bg-[rgba(20,22,35,0.55)]  rounded-xl py-1 pl-2`}
            {...register("email")}
          />
          {errors.email && <p className="text-sm text-red-300">{errors.email.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm">Mobile No.</label>
          <input
            type="text"
            placeholder="Enter mobile here"
            inputMode="numeric"
            className={`border ${errors.phone ? "border-red-300 focus:ring-2 focus:ring-red-300" : "  border-blur-[14px] border-white/20"} bg-[rgba(20,22,35,0.55)]  rounded-xl py-1 pl-2`}
            {...register("phone")}
          />
          {errors.phone && <p className="text-sm text-red-300">{errors.phone.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm">Aadhaar No.</label>
          <input
            type="text"
            placeholder="Enter aadhaar here"
            inputMode="numeric"
            className={`border ${errors.aadhaarNo ? "border-red-300 focus:ring-2 focus:ring-red-300" : " border-blur-[14px] border-white/20"} bg-[rgba(20,22,35,0.55)]  rounded-xl py-1 pl-2`}
            {...register("aadhaarNo")}
          />
          {errors.aadhaarNo && <p className="text-sm text-red-300">{errors.aadhaarNo.message}</p>}
        </div>
        {/* <div>
          <label>Gender</label>
          <div className="flex gap-3">
            <input type="radio" {...register("gender")} id="gender" value="male"/>Male
            <input type="radio" {...register("gender")} id="gender" value="female"/>Female
            <input type="radio" {...register("gender")} id="gender" value="others"/>Others
          </div>
        </div> */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm">Password</label>
          <div className="relative">
            <input
              type={!showPassword ? "password" : "text"}
              placeholder="Enter password here"
              className={`border ${errors.password ? "border-red-300 focus:ring-2 focus:ring-red-300" : " border-blur-[14px] border-white/20"} bg-[rgba(20,22,35,0.55)]  rounded-xl py-1.5 pl-2 pr-10 w-full`}
              {...register("password")}
            />
            {!showPassword ? (
              <EyeOffIcon
                onClick={() => setShowPassword(true)}
                className="absolute right-2 inset-y-0 top-2 size-5 text-neutral-400"
              />
            ) : (
              <Eye
                onClick={() => setShowPassword(false)}
                className=" absolute inset-y-0 right-2 top-2 size-5 text-neutral-400"
              />
            )}
          </div>
          {errors.password && <p className="text-sm text-red-300">{errors.password.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm">Confirm Password</label>
          <div className="relative">
            <input
              type={!showConfirmPassword ? "password" : "text"}
              placeholder="Enter password again here"
              className={`border ${errors.confirmPassword ? "border-red-300 focus:ring-2 focus:ring-red-300" : " border-blur-[14px] border-white/20"} bg-[rgba(20,22,35,0.55)]  rounded-xl py-1.5 pl-2 pr-10 w-full`}
              {...register("confirmPassword")}
            />
            {!showConfirmPassword ? (
              <EyeOffIcon
                onClick={() => setShowConfirmPassword(true)}
                className="absolute right-2 inset-y-0 top-2 size-5 text-neutral-400"
              />
            ) : (
              <Eye
                onClick={() => setShowConfirmPassword(false)}
                className=" absolute inset-y-0 right-2 top-2 size-5 text-neutral-500"
              />
            )}
          </div>
          {errors.confirmPassword && <p className="text-sm text-red-300">{errors.confirmPassword.message}</p>}
        </div>
        <div className="mx-auto mt-3 w-full">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary px-3 py-1 rounded-md font-semibold w-full cursor-pointer flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Register"
            )}
          </button>
          <p className="text-sm mt-3 text-center">
            Already Have An account ?{" "}
            <Link className="text-highlight" to={"/login"}>
              Login Here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signin;
