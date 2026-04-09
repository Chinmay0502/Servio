import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddService = () => {
  const { register, handleSubmit, watch, reset } = useForm();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [images, setImages] = useState([]);

  const categoryId = watch("categoryId");
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/category/get-all-categories",
        {
          withCredentials: true,
        },
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

    const formData = new FormData();
    formData.append("categoryId", data.categoryId);
    formData.append(
      "subCategory",
      JSON.stringify({
        name: data.name,
        description: data.description,
        price: Number(data.price),
      }),
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
        },
      );

      console.log(res.data);
      toast.success("Service added successfully");
      reset();
      setImages([]);
      navigate("/serviceProvider");
    } catch (error) {
      console.log(error.response?.data);
      toast.error(error.response?.data || "Something went wrong");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto mt-20 border border-white/20 rounded-2xl bg-[rgba(20,22,35,0.55)] p-6 flex flex-col gap-5"
    >
      <h2 className="text-xl font-bold text-highlight">Create Service</h2>

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

      {selectedCategory && (
        <div className="text-sm text-gray-300">
          Price Range: ₹{selectedCategory.priceRange.low} - ₹
          {selectedCategory.priceRange.high}
        </div>
      )}

      <input
        type="text"
        placeholder="Service Name"
        {...register("name", { required: true })}
        className="border border-white/20 rounded-md px-3 py-2 bg-transparent"
      />

      <textarea
        placeholder="Service Description"
        {...register("description", { required: true })}
        className="border border-white/20 rounded-md px-3 py-2 bg-transparent"
      />

      <input
        type="number"
        placeholder="Service Price"
        {...register("price", { required: true })}
        min={selectedCategory?.priceRange?.low}
        max={selectedCategory?.priceRange?.high}
        className="border border-white/20 rounded-md px-3 py-2 bg-transparent"
      />

      {/* Multiple Image Upload */}
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

      <button
        type="submit"
        className="bg-primary px-4 py-2 rounded-md font-semibold cursor-pointer"
      >
        Send Request
      </button>
    </form>
  );
};

export default AddService;
