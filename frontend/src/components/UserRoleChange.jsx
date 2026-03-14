import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const RequestForm = () => {
  const { register, handleSubmit } = useForm();
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/category");
      setCategories(res.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Submit request
  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:8000/api/request", data, 
        { withCredentials: true});

      console.log(res.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  return (
    <form className="fixed inset-x-150 inset-y-60 border border-blur-[14px] rounded-2xl bg-[rgba(20,22,35,0.55)] border-white/20 p-5 flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
      <label className="font-bold text-highlight text-lg">Select Category</label>

      <select {...register("categoryId")} className="border border-blur-[14px] border-white/20 rounded-md px-3 py-1.5">
        <option className="bg-transparent" value="">Select Category</option>

        {categories.map((cat) => (
          <option className="bg-[rgba(20,22,35,0.55)]" key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <button type="submit" className="bg-primary px-2 py-1 rounded-md font-semibold">Send Request</button>
    </form>
  );
};

export default RequestForm;
