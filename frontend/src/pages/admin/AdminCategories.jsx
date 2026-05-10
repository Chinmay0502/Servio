import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Plus, Edit, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/category/get-all-categories", {
        withCredentials: true,
      });
      setCategories(res.data.categories);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        description: data.description,
        low: parseInt(data.low),
        high: parseInt(data.high),
      };
      await axios.post("http://localhost:8000/api/category/create-category", payload, {
        withCredentials: true,
      });
      toast.success("Category created successfully");
      reset();
      setShowForm(false);
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error creating category");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/admin/change-category-status/${id}`, {}, {
        withCredentials: true,
      });
      toast.success("Category status updated");
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error("Error updating status");
    }
  };

  return (
    <div className="w-full border border-white/10 rounded-2xl p-6 mb-6 bg-gradient-to-br from-[#0d0d1a] via-[#12122a] to-[#0d0d1a] shadow-xl">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Categories</h2>
          <p className="text-gray-400 text-sm mt-1">Manage service categories and their price ranges.</p>
        </div>
        {!showForm && (
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-highlight hover:bg-primary text-white px-4 py-2 rounded-xl transition-all font-semibold"
          >
            <Plus size={18} /> Add Category
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Create New Category</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-300">Name</label>
              <input type="text" className="p-2 bg-transparent border border-white/20 rounded-lg outline-none focus:border-highlight" {...register("name", { required: true })} />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-sm font-semibold text-gray-300">Description</label>
              <textarea className="p-2 bg-transparent border border-white/20 rounded-lg outline-none focus:border-highlight h-24" {...register("description", { required: true })} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-300">Min Price (₹)</label>
              <input type="number" className="p-2 bg-transparent border border-white/20 rounded-lg outline-none focus:border-highlight" {...register("low", { required: true, min: 0 })} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-300">Max Price (₹)</label>
              <input type="number" className="p-2 bg-transparent border border-white/20 rounded-lg outline-none focus:border-highlight" {...register("high", { required: true, min: 0 })} />
            </div>
            
            <div className="md:col-span-2 flex gap-4 mt-4">
              <button type="submit" disabled={isLoading} className="bg-highlight hover:bg-primary py-2 px-6 rounded-lg font-semibold flex justify-center items-center transition-all disabled:opacity-50">
                {isLoading ? <Loader2 className="animate-spin size-5" /> : "Save"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-transparent border border-white/20 hover:bg-white/5 py-2 px-6 rounded-lg font-semibold transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div key={cat._id} className="border border-white/10 rounded-2xl p-6 bg-white/5 backdrop-blur-md shadow-lg hover:border-purple-500/40 transition-all duration-300">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white">{cat.name}</h3>
              <span className={`px-2 py-1 text-xs rounded-full font-bold ${cat.isActive ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                {cat.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <p className="text-gray-400 text-sm mt-1 h-10 overflow-hidden line-clamp-2">{cat.description}</p>
            <div className="mt-4 p-3 rounded-xl border border-white/10 bg-black/20">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-mono">Price Range</p>
              <p className="text-green-400 font-bold mt-1">₹{cat.priceRange?.low} - ₹{cat.priceRange?.high}</p>
            </div>
            <div className="mt-4 flex gap-3">
              <button 
                onClick={() => toggleStatus(cat._id)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold tracking-wide transition-all ${cat.isActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30'}`}
              >
                {cat.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
