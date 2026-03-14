import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOffIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

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
  } = useForm();
  async function submit(formData) {
    if (isLoading) return;
    console.log(formData);
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/user/register",
        formData,
      );
      toast.success(res.data.message || "User created successfully");
      navigate("/services");
    } catch (error) {
      console.error(error);
      toast.error("Error creating user");
    } finally {
      setIsLoading(false);
    }

    reset();
  }
  return (
    <div className="rounded-br-2xl rounded-tr-2xl shadow-xl shadow-primary transition-all border border-blur-[14px] bg-[rgba(20,22,35,0.55)] border-white/20 rounded-xl w-full max-w-4/5 md:max-w-2/4 lg:max-w-1/3 p-5 mx-auto mt-20 lg:mt-5 mb-8">
      <div className="mx-auto px-2 py-1 rounded-full flex flex-col justify-center items-center">
        <img src="/Final_Logo.png" className="w-[2rem]" />
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
            className="border border-blur-[14px] bg-[rgba(20,22,35,0.55)] border-white/20  rounded-xl py-1 pl-2"
            {...register("name")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm">Email</label>
          <input
            type="email"
            placeholder="Enter email here"
            className="border border-blur-[14px] bg-[rgba(20,22,35,0.55)] border-white/20 rounded-xl py-1 pl-2"
            {...register("email")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm">Mobile No.</label>
          <input
            type="text"
            placeholder="Enter mobile here"
            className="border border-blur-[14px] bg-[rgba(20,22,35,0.55)] border-white/20  rounded-xl py-1 pl-2"
            {...register("phone")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm">Aadhaar No.</label>
          <input
            type="text"
            placeholder="Enter aadhaar here"
            className="border border-blur-[14px] bg-[rgba(20,22,35,0.55)] border-white/20  rounded-xl py-1 pl-2"
            {...register("aadhaarNo")}
          />
        </div>
        <div>
          <label>Gender</label>
          <div className="flex gap-3">
            <input type="radio" {...register("gender")} id="gender" value="male"/>Male
            <input type="radio" {...register("gender")} id="gender" value="female"/>Female
            <input type="radio" {...register("gender")} id="gender" value="others"/>Others
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm">Password</label>
          <div className="relative">
            <input
              type={!showPassword ? "password" : "text"}
              placeholder="Enter password here"
              className="border border-blur-[14px] bg-[rgba(20,22,35,0.55)] border-white/20 rounded-xl py-1.5 pl-2 pr-10 w-full"
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
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-sm">Confirm Password</label>
          <div className="relative">
            <input
              type={!showConfirmPassword ? "password" : "text"}
              placeholder="Enter password again here"
              className="border border-blur-[14px] bg-[rgba(20,22,35,0.55)] border-white/20 rounded-xl py-1 pl-2 pr-10 w-full"
              {...register("password")}
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
