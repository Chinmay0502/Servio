import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ServiceRequest = () => {
  const { register, handleSubmit, watch, reset } = useForm();

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false); // ✅ LOADER STATE

  const categoryId = watch("categoryId");
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/category/get-all-categories",
        { withCredentials: true }
      );
      setCategories(res.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const cat = categories.find((c) => c._id === categoryId);
    setSelectedCategory(cat);
  }, [categoryId, categories]);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setLoading(true); // ✅ START LOADING

    const formData = new FormData();
    formData.append("categoryId", data.categoryId);
    formData.append(
      "subCategory",
      JSON.stringify({
        name: data.name,
        description: data.description,
        price: Number(data.price),
      })
    );

    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      const res = await axios.post(
        "http://localhost:8000/api/service-provider/request",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Service added successfully");
      reset();
      setImages([]);
      navigate("/profile");
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data || "Something went wrong");
    } finally {
      setLoading(false); // ✅ STOP LOADING
    }
  };

  return (
    <div className="px-5 lg:px-0">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-lg mx-auto mt-20 border border-white/20 rounded-2xl bg-[rgba(20,22,35,0.55)] p-5 flex flex-col gap-5"
      >
        <h2 className="text-xl font-bold text-highlight">Create Service</h2>

        {/* CATEGORY */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Select Category</label>
          <select
            {...register("categoryId", { required: true })}
            className="border border-white/20 rounded-md px-3 py-2 bg-transparent"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id} className="bg-black">
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* PRICE RANGE */}
        {selectedCategory && (
          <div className="text-sm text-gray-300">
            Price Range: ₹{selectedCategory.priceRange.low} - ₹
            {selectedCategory.priceRange.high}
          </div>
        )}

        {/* NAME */}
        <input
          type="text"
          placeholder="Service Name"
          {...register("name", { required: true })}
          className="border border-white/20 rounded-md px-3 py-2 bg-transparent"
        />

        {/* DESCRIPTION */}
        <textarea
          placeholder="Service Description"
          {...register("description", { required: true })}
          className="border border-white/20 rounded-md px-3 py-2 bg-transparent"
        />

        {/* PRICE */}
        <input
          type="number"
          placeholder="Service Price"
          {...register("price", { required: true })}
          min={selectedCategory?.priceRange?.low}
          max={selectedCategory?.priceRange?.high}
          className="border border-white/20 rounded-md px-3 py-2 bg-transparent"
        />

        {/* IMAGE UPLOAD */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="border border-white/20 rounded-md px-3 py-2 bg-transparent"
          />
          {images.length > 0 && (
            <div className="text-sm text-gray-300">
              {images.length} image(s) selected
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON WITH LOADER */}
        <button
          type="submit"
          disabled={loading}
          className="bg-primary px-4 py-2 rounded-md font-semibold cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading ? (
            <>
              <svg
                className="w-5 h-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Sending...
            </>
          ) : (
            "Send Request"
          )}
        </button>
      </form>
    </div>
  );
};

export default ServiceRequest;