import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

// ✅ Validation Schema
const UpdateSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Enter valid phone number"),
    aadhaarNo: z.string().min(12, "Aadhaar must be 12 digits"),
    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
});

const UpdateProfile = () => {

    const user = useSelector((state) => state.user.value);
    console.log(user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [file, setFile] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(UpdateSchema),
    });

    // Prefill data
    useEffect(() => {
        if (user) {
            setValue("name", user.name);
            setValue("phone", user.phone);
            setValue("aadhaarNo", user.aadhaarNo || "");
            setValue("gender", user.gender);

            if (user.image) {
                setImagePreview(user.image);
            }
        }
    }, [user]);

    // Handle image change
    const handleImageChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        setFile(selected);
        setImagePreview(URL.createObjectURL(selected));
    };

    const submit = async (formData) => {
        if (isLoading) return;

        setIsLoading(true);

        try {
            const data = new FormData();

            data.append("name", formData.name);
            data.append("phone", formData.phone);
            data.append("aadhaarNo", formData.aadhaarNo);
            data.append("gender", formData.gender);

            if (file) {
                data.append("profileImage", file);
            }

            const res = await axios.post(
                "http://localhost:8000/api/auth/user/update",
                data,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            dispatch(login(res.data.user)); // update redux
            toast.success(res.data.message || "Profile updated successfully");

            navigate("/profile");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mt-5 flex justify-center px-4">
            <div className="w-full max-w-2xl pt-2 pb-4 px-6 rounded-2xl border border-white/20 bg-[rgba(20,22,35,0.55)] shadow-xl">

                {/* Header */}
                <h2 className="text-xl font-semibold text-center text-highlight mb-5">
                    Update Profile
                </h2>

                {/* Image Upload */}
                <div className="flex flex-col items-center gap-2.5 mb-6">
                    <img
                        src={imagePreview || "/Profile_Image.jpg"}
                        className="w-28 h-28 rounded-full object-cover border"
                    />

                    <label className="cursor-pointer bg-highlight px-3 py-1 rounded-md text-sm font-semibold">
                        Change Image
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>
                    <span className="text-red-100 text-xs">Image should be within 100KB</span>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(submit)}
                    className="flex flex-col gap-4"
                >
                    {/* Name */}
                    <div>
                        <label className="font-semibold">Name</label>
                        <input
                            type="text"
                            className={`w-full mt-1 p-2 rounded-lg bg-transparent border ${errors.name ? "border-red-400" : "border-white/20"
                                }`}
                            {...register("name")}
                        />
                        {errors.name && (
                            <p className="text-red-400 text-sm">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="font-semibold">Phone</label>
                        <input
                            type="text"
                            className={`w-full mt-1 p-2 rounded-lg bg-transparent border ${errors.phone ? "border-red-400" : "border-white/20"
                                }`}
                            {...register("phone")}
                        />
                        {errors.phone && (
                            <p className="text-red-400 text-sm">{errors.phone.message}</p>
                        )}
                    </div>

                    {/* Aadhaar */}
                    <div>
                        <label className="font-semibold">Aadhaar</label>
                        <input
                            type="text"
                            className={`w-full mt-1 p-2 rounded-lg bg-transparent border ${errors.aadhaarNo ? "border-red-400" : "border-white/20"
                                }`}
                            {...register("aadhaarNo")}
                        />
                        {errors.aadhaarNo && (
                            <p className="text-red-400 text-sm">
                                {errors.aadhaarNo.message}
                            </p>
                        )}
                    </div>

                    {/* Gender */}
                    {/* Gender */}
                    <div>
                        <label className="font-semibold mb-2 block">Gender</label>

                        <div className="flex justify-between px-6 md:px-20">

                            {/* MALE */}
                            <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg border border-white/20 bg-[rgba(20,22,35,0.55)] hover:border-highlight transition">
                                <input
                                    type="radio"
                                    value="MALE"
                                    {...register("gender")}
                                    className="accent-primary cursor-pointer"
                                />
                                <span>Male</span>
                            </label>

                            {/* FEMALE */}
                            <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg border border-white/20 bg-[rgba(20,22,35,0.55)] hover:border-highlight transition">
                                <input
                                    type="radio"
                                    value="FEMALE"
                                    {...register("gender")}
                                    className="accent-primary cursor-pointer"
                                />
                                <span>Female</span>
                            </label>

                            {/* OTHER */}
                            <label className="flex items-center gap-2 cursor-pointer px-3 py-1.5 rounded-lg border border-white/20 bg-[rgba(20,22,35,0.55)] hover:border-highlight transition">
                                <input
                                    type="radio"
                                    value="OTHER"
                                    {...register("gender")}
                                    className="accent-primary cursor-pointer"
                                />
                                <span>Other</span>
                            </label>

                        </div>

                        {errors.gender && (
                            <p className="text-red-400 text-sm mt-1">
                                {errors.gender.message}
                            </p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-4 bg-primary py-2 rounded-lg font-semibold flex justify-center items-center disabled:opacity-50 cursor-pointer"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin size-6" />
                        ) : (
                            "Update Profile"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;