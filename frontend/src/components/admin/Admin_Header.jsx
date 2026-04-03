import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

const Admin_Header = () => {

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm();

  async function getAllCategories() {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/category/get-all-categories",
        { withCredentials: true }
      );

      setCategories(res.data.categories);

    } catch (error) {
      toast.error("Error getting categories");
    }
  }

  useEffect(() => {
    getAllCategories();
  }, []);

  const onSubmit = async (data) => {

    try {

      const res = await axios.post(
        "http://localhost:8000/api/category/create",
        data,
        { withCredentials: true }
      );

      toast.success("New category added successfully");

      reset();
      setOpenModal(false);
      getAllCategories();

    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  async function handleLogout() {
    if (isLoading) return;

    setIsLoading(true);

    try {

      const res = await axios.get(
        "http://localhost:8000/api/admin/logout",
        { withCredentials: true }
      );

      toast.success(res.data.message);
      navigate("/");

    } catch (error) {
      toast.error("Error logging out user");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className=" w-full border border-white/20 p-5 rounded-2xl bg-[rgba(20,22,35,0.55)] md:w-1/5 h-[35rem]">

        <h2 className="font-bold text-center text-xl">Hii Admin</h2>

        <p className="font-semibold text-highlight text-lg text-center mt-5">
          Categories
        </p>

        <div className="flex justify-center mt-2">
          <button
            onClick={() => setOpenModal(true)}
            className="bg-primary px-2 py-1 rounded-md text-sm font-semibold cursor-pointer"
          >
            Add New Category
          </button>
        </div>

        <div className="border border-white/20 p-5 rounded-2xl mt-3 font-semibold h-[18rem] overflow-y-auto">
          <ul>
            {categories.map((cat) => (
              <li key={cat._id}>{cat.name}</li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center mt-3">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-primary px-4 py-2 text-sm rounded-md font-semibold flex justify-center disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="animate-spin size-6" />
            ) : (
              "Logout"
            )}
          </button>
        </div>
      </div>

      {/* Popup Modal */}
      {openModal && (
        <div className="px-5 fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm border-white/20">

          <div className="bg-[rgba(20,22,35,0.55)] border border-white/20 p-6 rounded-xl w-[400px]">

            <h2 className="text-xl font-bold mb-4 text-highlight">Add Category</h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-3"
            >

              <input
                type="text"
                placeholder="Category Name"
                {...register("name", { required: true })}
                className="p-2 border border-white/20 rounded bg-transparent"
              />

              <textarea
                placeholder="Description"
                {...register("description", { required: true })}
                className="p-2 border border-white/20 rounded bg-transparent"
              />

              <input
                type="number"
                placeholder="Low Price"
                {...register("low", { required: true })}
                className="p-2 border border-white/20 rounded bg-transparent"
              />

              <input
                type="number"
                placeholder="High Price"
                {...register("high", { required: true })}
                className="p-2 border border-white/20 rounded bg-transparent"
              />

              <div className="flex gap-3 mt-2">

                <button
                  type="submit"
                  className="flex-1 bg-green-600 py-2 rounded font-semibold cursor-pointer"
                >
                  Add
                </button>

                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="flex-1 bg-red-600 py-2 rounded font-semibold cursor-pointer"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>
      )}
    </>
  );
};

export default Admin_Header;