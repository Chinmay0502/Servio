import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const Service_Hero = () => {

  const [services, setServices] = useState([]);
  const scrollRef = useRef(null);

  const fetchServices = async () => {
    try {

      const res = await axios.get(
        "http://localhost:8000/api/services/get-all-services"
      );

      setServices(res.data.services);

    } catch (error) {
      console.log(error.response?.data);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -500,
      behavior: "smooth"
    });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 500,
      behavior: "smooth"
    });
  };

  return (
    <section className="w-full py-12">

      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">
            Popular Services
          </h2>

          {/* Mobile Screen Arrows */}
          <div className="flex gap-3 md:hidden">
            <button
              onClick={scrollLeft}
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
            >
              <FaArrowLeft />
            </button>

            <button
              onClick={scrollRight}
              className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible scroll-smooth"
        >

          {services.map((service) => (

            <div
              key={service._id}
              className="min-w-[22rem] md:min-w-0 p-6 rounded-xl bg-[rgba(20,22,35,0.65)] border border-white/10 backdrop-blur-md shadow-lg 
              transition-all duration-300 cursor-pointer 
              hover:scale-105 hover:shadow-2xl hover:border-white/30"
            >

              <h3 className="text-xl font-semibold mb-2">
                {service.name}
              </h3>

              <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                {service.description}
              </p>

              <p className="text-sm">
                <span className="font-semibold">Category:</span>{" "}
                {service.categoryId?.name}
              </p>

              <p className="text-sm">
                <span className="font-semibold">Provider:</span>{" "}
                {service.providerId?.name}
              </p>

              <p className="text-lg font-bold mt-2 text-green-400">
                ₹{service.price}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default Service_Hero;