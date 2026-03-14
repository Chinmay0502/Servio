import axios from "axios";
import { Link } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Admin_Header = () => {
  const [categories, setCategories] = useState([]);
  async function getAllCategories() {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/category/get-all-categories",
        { withCredentials: true },
      );
      console.log(res.data.categories);
      setCategories(res.data.categories);
    } catch (error) {
      console.log(error.response);
      toast.error("Error getting in all categories");
    }
  }
  useEffect(() => {
    getAllCategories();
  }, []);
  return (
    <div className="border border-blur-[14px] border-white/20 p-5 rounded-2xl bg-[rgba(20,22,35,0.55)] w-1/5 h-[35rem]">
      <h2 className="font-bold text-center text-xl">Hii Admin</h2>
      <p className="font-semibold text-highlight text-lg text-center mt-5">Categories</p>
      <div className="flex items-center justify-center mt-2">
      <button className="bg-primary px-2 py-1 rounded-md text-sm font-semibold">Add New category</button>
      </div>
      <div className="border border-blur-[14px] border-white/20 p-5 rounded-2xl mt-3 font-semibold">
        <ul>
          {categories.map((cat) => (
            <li key={cat._id}>{cat.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Admin_Header;
