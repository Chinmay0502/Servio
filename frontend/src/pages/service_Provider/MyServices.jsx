import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/api";

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // EDIT STATES
  const [editService, setEditService] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  // FETCH SERVICES
  const fetchMyServices = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "/services/my-services",
        { withCredentials: true },
      );

      setServices(res.data.services || []);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyServices();
  }, []);

  // TOGGLE STATUS
  const toggleStatus = async (serviceId) => {
    try {
      setUpdatingId(serviceId);

      const res = await api.put(
        `/services/toggle-status/${serviceId}`,
        {},
        { withCredentials: true },
      );

      setServices((prev) =>
        prev.map((s) =>
          s._id === serviceId
            ? { ...s, isActive: res.data.service.isActive }
            : s,
        ),
      );
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // OPEN EDIT MODAL
  const openEditModal = (service) => {
    setEditService(service);
    setEditForm({
      name: service.name || "",
      price: service.price || "",
      description: service.description || "",
    });
  };

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  // UPDATE SERVICE API
  const handleUpdateService = async () => {
  try {
    setSaving(true);

    const res = await api.put(
      `/services/${editService._id}`,
      editForm,
      { withCredentials: true }
    );

    setServices((prev) =>
      prev.map((s) =>
        s._id === editService._id ? res.data.service : s
      )
    );

    setEditService(null);
  } catch (error) {
    console.log(error.response?.data || error.message);
  } finally {
    setSaving(false);
  }
};

  return (
    <div className="min-h-screen px-12 py-10">
      <h1 className="text-2xl font-bold text-white mb-6">🛠 My Services</h1>

      {/* LOADING */}
      {loading && <p className="text-white/60 text-sm">Loading services...</p>}

      {/* EMPTY STATE */}
      {!loading && services.length === 0 && (
        <p className="text-white/60">No services found</p>
      )}

      {/* GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-[#11112a] border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* IMAGE */}
            {service.images?.length > 0 ? (
              <img
                src={service.images[0]?.url}
                className="w-full h-40 object-cover"
                alt="service"
              />
            ) : (
              <div className="w-full h-40 flex items-center justify-center text-white/40">
                No Image
              </div>
            )}

            <div className="p-5">
              {/* NAME */}
              <h2 className="text-white font-semibold">{service.name}</h2>

              {/* PRICE */}
              <p className="text-highlight mt-1">₹{service.price}</p>

              {/* STATUS */}
              <span
                className={`text-xs px-3 py-1 rounded-full mt-3 inline-block ${
                  service.isActive
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {service.isActive ? "Active" : "Inactive"}
              </span>

              {/* TOGGLE */}
              <button
                onClick={() => toggleStatus(service._id)}
                disabled={updatingId === service._id}
                className={`w-full mt-4 py-2 rounded-lg text-sm font-semibold transition ${
                  service.isActive
                    ? "bg-red-500/10 border border-red-400 text-red-400 hover:bg-red-500/20"
                    : "bg-green-500/10 border border-green-400 text-green-400 hover:bg-green-500/20"
                }`}
              >
                {updatingId === service._id
                  ? "Updating..."
                  : service.isActive
                    ? "Deactivate"
                    : "Activate"}
              </button>

              {/* EDIT BUTTON */}
              <button
                onClick={() => openEditModal(service)}
                className="w-full mt-2 py-2 rounded-lg text-sm font-semibold bg-blue-500/10 border border-blue-400 text-blue-400 hover:bg-blue-500/20"
              >
                Edit Service
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {editService && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#11112a] w-[90%] max-w-md p-6 rounded-2xl border border-white/10">
            <h2 className="text-white text-xl font-semibold mb-4">
              Edit Service
            </h2>

            {/* NAME */}
            <input
              name="name"
              value={editForm.name}
              onChange={handleChange}
              placeholder="Service Name"
              className="w-full mb-3 p-2 rounded bg-black/30 text-white border border-white/10"
            />

            {/* PRICE */}
            <input
              name="price"
              value={editForm.price}
              onChange={handleChange}
              placeholder="Price"
              type="number"
              className="w-full mb-3 p-2 rounded bg-black/30 text-white border border-white/10"
            />

            {/* DESCRIPTION */}
            <textarea
              name="description"
              value={editForm.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full mb-4 p-2 rounded bg-black/30 text-white border border-white/10 h-[20vh]"
            />

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button
                onClick={() => setEditService(null)}
                className="w-full py-2 rounded bg-red-500/20 text-red-400 border border-red-400"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateService}
                disabled={saving}
                className="w-full py-2 rounded bg-green-500/20 text-green-400 border border-green-400"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyServices;
