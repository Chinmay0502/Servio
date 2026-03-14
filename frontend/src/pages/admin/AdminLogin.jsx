import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminLogin = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  async function submit(formData) {
    try {
      setIsLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/admin/login",
        formData,
        { withCredentials: true },
      );
      toast.success(res.data.message || "Admin  logged in successfully");
      navigate("/admin/adminDashboard");
      reset();
    } catch (error) {
      console.log(error);
      toast.error("Error logging in admin");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="flex justify-center items-center mt-10 pt-16">
      <div className="w-3/4 md:w-1/3 bg-[rgba(20,22,35,0.55)] border border-white/20 border-blur-[14px] rounded-md p-5 md:p-8 flex flex-col gap-5">
        <div className=" bg-highlight rounded-md py-1">
          <div className="font-bold text-xl text-center">Login Here</div>
        </div>
        <div>
          <form
            className="p-2 flex flex-col gap-4"
            onSubmit={handleSubmit(submit)}
          >
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-lg">Email</label>
              <input
                type="email"
                className="border border-white/20 border-blur-[14px] rounded-md h-[2.5rem] p-2"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-lg">Password</label>
              <input
                type="password"
                className="border border-white/20 border-blur-[14px] rounded-md h-[2.5rem] p-2"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-400 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex justify-center mt-3">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-highlight rounded-md p-2 text-sm font-semibold w-[10rem]"
              >
                {isLoading ? <Loader2 className="animate-spin size-6"/> : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
