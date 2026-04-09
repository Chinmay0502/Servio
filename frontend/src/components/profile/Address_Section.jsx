import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { State, City } from "country-state-city";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import {
  addAddress,
  setAddresses,
} from "../../redux/slices/addressSlice";
import { toast } from "react-toastify";
import privateAxios from "../../api/privateAxios";

const addressSchema = z.object({
  houseNo: z.string().min(1, "House No required"),
  street: z.string().min(1, "Street required"),
  area: z.string().min(1, "Area required"),
  landmark: z.string().optional(),
  city: z.string().min(1, "City required"),
  state: z.string().min(1, "State required"),
  pincode: z
    .string()
    .length(6, "Pincode must be 6 digits")
    .regex(/^[1-9][0-9]{5}$/, "Invalid pincode"),
});

const Address_Section = () => {
  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.address.list);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedStateCode, setSelectedStateCode] = useState("");
  const [selectedStateName, setSelectedStateName] = useState("");

  const [editingAddress, setEditingAddress] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    setStates(State.getStatesOfCountry("IN"));
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/address");
      dispatch(setAddresses(res.data.addresses || []));
    } catch (err) {
      if (err.response?.status === 404) {
        dispatch(setAddresses([])); // fallback
      }
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleStateChange = (e) => {
    const stateCode = e.target.value;

    const selected = states.find((s) => s.isoCode === stateCode);

    setSelectedStateCode(stateCode);
    setSelectedStateName(selected.name);

    const cityList = City.getCitiesOfState("IN", stateCode);
    setCities(cityList);

    setValue("state", selected.name);
  };

  const getLocation = () =>
    new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            type: "Point",
            coordinates: [pos.coords.longitude, pos.coords.latitude],
          }),
        reject
      );
    });

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);

    try {
      const location = await getLocation();

      const payload = {
        ...data,
        state: selectedStateName,
        location,
      };

      if (editingAddress) {
        const res = await privateAxios.put(
          `/address/${editingAddress._id}`,
          payload
        );

        dispatch(
          setAddresses(
            addresses.map((a) =>
              a._id === editingAddress._id ? res.data.address : a
            )
          )
        );

        toast.success("Address updated");
      } else {
        const res = await privateAxios.post("/address", payload);

        dispatch(addAddress(res.data.address));
        toast.success("Address added");
      }

      reset();
      setShowModal(false);
      setEditingAddress(null);
      setCities([]);
    } catch (err) {
      console.error(err);
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id) => {
    try {
      await privateAxios.delete(`/address/${id}`);

      dispatch(setAddresses(addresses.filter((a) => a._id !== id)));
      toast.success("Deleted successfully");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (addr) => {
    setEditingAddress(addr);
    setShowModal(true);

    const stateObj = states.find((s) => s.name === addr.state);

    if (stateObj) {
      setSelectedStateCode(stateObj.isoCode);
      setSelectedStateName(stateObj.name);

      const cityList = City.getCitiesOfState("IN", stateObj.isoCode);
      setCities(cityList);
    }

    reset({
      houseNo: addr.houseNo,
      street: addr.street,
      area: addr.area,
      landmark: addr.landmark || "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    });
  };

  return (
    <div className="rounded-2xl shadow-xl border border-white/20 bg-[rgba(20,22,35,0.55)] p-5 lg:w-[67rem] lg:mt-5">
      {/* Header */}
      <div className="flex justify-between">
        <h2 className="font-bold text-highlight text-xl">Addresses</h2>
        <button
          onClick={() => {
            setShowModal(true);
            setEditingAddress(null);
            reset();
          }}
          className="bg-primary px-2 py-1 rounded-md cursor-pointer"
        >
          New Address +
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
        {addresses.length === 0 ? (
          <p>No Address Added</p>
        ) : (
          addresses.map((addr, index) => (
            <div key={addr._id} className="border p-3 rounded-md">
              <div className="flex justify-between">
                <p className="font-semibold text-primary">
                  Address {index + 1}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(addr)}
                    className="text-sm bg-blue-500 px-2 rounded cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(addr._id)}
                    className="text-sm bg-red-500 px-2 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <ul className="text-sm mt-2">
                <li>{addr.houseNo}</li>
                <li>{addr.street}</li>
                <li>{addr.area}</li>
                {addr.landmark && <li>Landmark: {addr.landmark}</li>}
                <li>{addr.city}</li>
                <li>{addr.state}</li>
                <li>{addr.pincode}</li>
              </ul>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-[rgba(20,22,35,0.95)] p-6 rounded-xl w-full md:w-9/10 lg:w-[500px] h-full md:h-auto border border-white/20"> 
          <h2 className="text-lg font-bold mb-4 text-highlight"> Add Address </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {
                ["houseNo", "street", "area", "pincode",].map((field) => (
                  <div key={field} className="flex flex-col gap-1">
                    <input {...register(field)} placeholder={field} className={`border ${errors[field] ? "border-red-300" : "border-white/20"} bg-[rgba(20,22,35,0.55)] rounded-xl py-1.5 pl-2`} /> {errors[field] && (<p className="text-red-300 text-sm"> {errors[field].message} </p>)} </div>))}

              <textarea
                {...register("landmark")}
                placeholder="landmark"
                className="w-full p-2 border border-white/20 rounded-xl bg-transparent"
              />

              {/* State */}
              <select
                value={selectedStateCode}
                onChange={handleStateChange}
                className="border border-white/20 bg-primary rounded-xl py-1.5 px-2 block text-white appearance-none"
              >
                <option value="">Select State</option>
                {states.map((s) => (
                  <option key={s.isoCode} value={s.isoCode}>
                    {s.name}
                  </option>
                ))}
              </select>
              {errors.state && <p className="text-red-300 text-sm">{errors.state.message}</p>}

              {/* City */}
              <select
                {...register("city")}
                disabled={!selectedStateCode}
                className="block border border-white/20 bg-primary rounded-xl py-1.5 px-2 text-white appearance-none"
              >
                <option value="">Select City</option>
                {cities.map((c) => (
                  <option key={c.name}>{c.name}</option>
                ))}
              </select>
              {errors.city && <p className="text-red-300 text-sm">{errors.city.message}</p>}
              {/* Buttons */}
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-3 py-1 bg-gray-500 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="px-3 py-1 bg-primary rounded flex justify-center items-center disabled:opacity-50 cursor-pointer">
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Address_Section;