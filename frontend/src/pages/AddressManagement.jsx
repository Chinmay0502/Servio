import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2, Plus, Edit2, Trash2, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import {Link} from "react-router-dom";

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchAddresses = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/address", {
        withCredentials: true,
      });
      setAddresses(res.data.addresses);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAddLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setValue("longitude", longitude);
          setValue("latitude", latitude);
          toast.success("Location fetched successfully!");
        },
        (err) => toast.error("Unable to retrieve your location")
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = {
        houseNo: data.houseNo,
        street: data.street,
        landmark: data.landmark,
        area: data.area,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        location: {
          type: "Point",
          coordinates: [parseFloat(data.longitude) || 0, parseFloat(data.latitude) || 0]
        },
        isDefault: data.isDefault || false
      };

      if (isEditing) {
        await axios.put(`http://localhost:8000/api/address/update/${editId}`, payload, {
          withCredentials: true,
        });
        toast.success("Address updated successfully");
      } else {
        await axios.post("http://localhost:8000/api/address/add", payload, {
          withCredentials: true,
        });
        toast.success("Address added successfully");
      }

      reset();
      setShowForm(false);
      setIsEditing(false);
      fetchAddresses();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error saving address");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to delete this address?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/address/delete/${id}`, {
        withCredentials: true,
      });
      toast.success("Address deleted");
      fetchAddresses();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting address");
    }
  };

  const handleEdit = (address) => {
    setIsEditing(true);
    setEditId(address._id);
    setValue("houseNo", address.houseNo);
    setValue("street", address.street);
    setValue("landmark", address.landmark);
    setValue("area", address.area);
    setValue("city", address.city);
    setValue("state", address.state);
    setValue("pincode", address.pincode);
    setValue("longitude", address.location?.coordinates[0] || "");
    setValue("latitude", address.location?.coordinates[1] || "");
    setValue("isDefault", address.isDefault);
    setShowForm(true);
  };

  return (
    <div className="flex justify-center px-4 py-10 min-h-screen">
      <div className="w-full max-w-4xl pt-6 pb-8 px-6 rounded-2xl border border-white/20 bg-[rgba(20,22,35,0.55)] shadow-xl text-white">
        
        <div className="flex justify-between items-center mb-8">
          <Link to="/profile" className="text-highlight hover:text-white transition-all">
            &larr; Back to Profile
          </Link>
          <h2 className="text-2xl font-semibold text-highlight">Manage Addresses</h2>
          {!showForm && (
            <button 
              onClick={() => { reset(); setIsEditing(false); setShowForm(true); }}
              className="bg-highlight hover:bg-primary px-4 py-2 rounded-md font-semibold text-sm transition-all flex items-center gap-2"
            >
              <Plus size={16} /> Add Address
            </button>
          )}
        </div>

        {showForm ? (
          <div className="bg-black/20 p-6 rounded-xl border border-white/10 mb-8">
            <h3 className="text-lg font-semibold mb-4">{isEditing ? "Edit Address" : "Add New Address"}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-300">House No</label>
                <input type="text" className="p-2 bg-transparent border border-white/20 rounded-lg outline-none focus:border-highlight" {...register("houseNo", { required: true })} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-300">Street</label>
                <input type="text" className="p-2 bg-transparent border border-white/20 rounded-lg outline-none focus:border-highlight" {...register("street", { required: true })} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-300">Landmark</label>
                <input type="text" className="p-2 bg-transparent border border-white/20 rounded-lg outline-none focus:border-highlight" {...register("landmark")} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-300">Area</label>
                <input type="text" className="p-2 bg-transparent border border-white/20 rounded-lg outline-none focus:border-highlight" {...register("area", { required: true })} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-300">City</label>
                <input type="text" className="p-2 bg-transparent border border-white/20 rounded-lg outline-none focus:border-highlight" {...register("city", { required: true })} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-300">State</label>
                <input type="text" className="p-2 bg-transparent border border-white/20 rounded-lg outline-none focus:border-highlight" {...register("state", { required: true })} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-300">Pincode</label>
                <input type="text" className="p-2 bg-transparent border border-white/20 rounded-lg outline-none focus:border-highlight" {...register("pincode", { required: true })} />
              </div>

              <div className="flex flex-col gap-1 md:col-span-2">
                <label className="text-sm font-semibold text-gray-300">Location Coordinates (Optional)</label>
                <div className="flex gap-2 items-center">
                  <input type="text" placeholder="Longitude" className="p-2 bg-transparent border border-white/20 rounded-lg outline-none focus:border-highlight w-1/2" {...register("longitude")} />
                  <input type="text" placeholder="Latitude" className="p-2 bg-transparent border border-white/20 rounded-lg outline-none focus:border-highlight w-1/2" {...register("latitude")} />
                  <button type="button" onClick={handleAddLocation} className="p-2 bg-primary hover:bg-highlight rounded-lg border border-white/20" title="Detect Location">
                    <MapPin size={20} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 items-center md:col-span-2">
                <input type="checkbox" id="isDefault" {...register("isDefault")} className="w-4 h-4 accent-highlight cursor-pointer" />
                <label htmlFor="isDefault" className="text-sm cursor-pointer">Set as Default Address</label>
              </div>

              <div className="md:col-span-2 flex gap-4 mt-4">
                <button type="submit" disabled={isLoading} className="flex-1 bg-highlight hover:bg-primary py-2 rounded-lg font-semibold flex justify-center transition-all disabled:opacity-50">
                  {isLoading ? <Loader2 className="animate-spin" /> : "Save Address"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-transparent border border-white/20 hover:bg-white/5 py-2 rounded-lg font-semibold transition-all">
                  Cancel
                </button>
              </div>

            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.length === 0 ? (
              <p className="text-gray-400 col-span-2 text-center py-10">No addresses found.</p>
            ) : (
              addresses.map((address) => (
                <div key={address._id} className="p-5 rounded-xl border border-white/10 bg-black/20 hover:border-purple-500/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{address.houseNo}, {address.street}</h3>
                      {address.isDefault && (
                        <span className="text-xs bg-highlight px-2 py-1 rounded-full font-semibold">Default</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-300">{address.landmark}</p>
                    <p className="text-sm text-gray-300">{address.area}, {address.city}, {address.state} - {address.pincode}</p>
                  </div>
                  <div className="flex gap-3 mt-4 border-t border-white/10 pt-4">
                    <button onClick={() => handleEdit(address)} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      <Edit2 size={14} /> Edit
                    </button>
                    <button onClick={() => handleDelete(address._id)} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AddressManagement;
