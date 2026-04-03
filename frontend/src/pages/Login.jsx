import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOffIcon, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import {login} from '../redux/slices/userSlice';
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be of atleast 6 characters")
})

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({resolver: zodResolver(LoginSchema)});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch= useDispatch();

  async function submit(formData) {
    if (isLoading) return;
    console.log(formData);
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/user/login",
        formData,
        {withCredentials: true}
      );
      dispatch(login(res.data.user))
      toast.success(res.data.message || "User logged in successfully");
      navigate("/services");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
    reset();
  }

  return (
    <div className="mt-8 px-2 lg:px-4 flex justify-center gap-20  lg:border border-blur-[14px] bg-transparent lg:bg-[rgba(20,22,35,0.55)] border-white/20 text-xl rounded-xl items-center py-10 w-3/4 mx-auto">
      <div className="rounded-br-2xl rounded-tr-2xl shadow-xl shadow-primary transition-all border border-blur-[14px] bg-[rgba(20,22,35,0.55)] border-white/20 text-xl rounded-xl w-full md:max-w-2/3 lg:max-w-2/4 p-5 md:p-10">
        <div className="mx-auto px-2 py-1 rounded-full flex flex-col justify-center items-center">
          <img src="/Final_Logo.png" className="w-8" />
          <h2 className="text-lg font-semibold text-center text-highlight w-full">
            Welcome Back To Servio
          </h2>
        </div>
        <form
          className="mt-5 flex gap-5 flex-col"
          onSubmit={handleSubmit(submit)}
        >
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-lg">Email</label>
            <input
              type="email"
              placeholder="Enter email here"
              className={`border bg-[rgba(20,22,35,0.55)]  text-xl rounded-xl py-1.5 pl-2 ${errors.email ? "border-red-300 focus:ring-2 focus:ring-red-300" : "border-blur-[14px] border-white/20"}`}
              {...register("email")}
            />
            {errors.email && <p className="text-sm text-red-300">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-lg">Password</label>
            <div className="relative">
              <input
                type={!showPassword ? "password" : "text"}
                placeholder="Enter password here"
                className={`border ${errors.password ? "border-red-300 focus:ring-2 focus:ring-red-300" : "border-blur-[14px] border-white/20"} bg-[rgba(20,22,35,0.55)]  text-xl rounded-xl py-1.5 pl-2 pr-10 w-full`}
                {...register("password")}
              />
              {!showPassword ? (
                <EyeOffIcon
                  onClick={() => setShowPassword(true)}
                  className="absolute right-2 inset-y-0 top-2"
                />
              ) : (
                <Eye
                  onClick={() => setShowPassword(false)}
                  className=" absolute inset-y-0 right-2 top-2"
                />
              )}
            </div>
            {errors.password && <p className="text-sm text-red-300">{errors.password.message}</p>}
          </div>
          <div className="mx-auto mt-5 w-full">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary px-3 py-1 rounded-md font-semibold w-full cursor-pointer flex justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="animate-spin size-6" />
              ) : (
                "Login"
              )}
            </button>
            <p className="text-sm mt-3 text-center">
              Don't Have An account ?{" "}
              <Link className="text-highlight" to={"/signin"}>
                Register Here
              </Link>
            </p>
          </div>
        </form>
      </div>
      <div className="hidden lg:block">
        <img src="/Service_Cover.png" className="w-100" />
      </div>
    </div>
  );
};

export default Login;
