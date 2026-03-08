import React from "react";
import { useForm } from "react-hook-form";

const AdminLogin = () => {
  const {register, handleSubmit, reset} = useForm()
  function submit(formData)
  {
    let email=formData.email
    let password = formData.password
    console.log(email, password)
    reset()
  }
  return (
    <div className="flex justify-center items-center mt-10 pt-16">
      <div className="w-3/4 md:w-1/3 bg-[rgba(20,22,35,0.55)] border border-white/20 border-blur-[14px] rounded-md p-5 md:p-8 flex flex-col gap-5">
        <div className=" bg-highlight rounded-md py-1">
          <div className="font-bold text-xl text-center">Login Here</div>
        </div>
        <div>
          <form className="p-2 flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-lg">Email</label>
              <input
                type="email"
                className="border border-white/20 border-blur-[14px] rounded-md h-[2.5rem] p-2"
                {...register("email")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-lg">Password</label>
              <input
                type="password"
                className="border border-white/20 border-blur-[14px] rounded-md h-[2.5rem] p-2"
                {...register("password")}
              />
            </div>
            <div className="flex justify-center mt-3">
              <button type="submit" className="bg-highlight rounded-md p-2 text-sm font-semibold w-[10rem]">
              Login
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
