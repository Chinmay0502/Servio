// components/ServiceCard.jsx

import { useNavigate } from "react-router-dom";

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/service/${service._id}`)}
      className="bg-[#12121f] border border-[#6c3be8]/25 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-primary hover:shadow-primary"
    >
      {/* IMAGE SCROLLER */}
      {service.images && service.images.length > 0 ? (
        <div className="w-full h-44 overflow-x-auto flex snap-x snap-mandatory scroll-smooth no-scrollbar">
          {service.images.map((img, index) => (
            <img
              key={index}
              src={img?.url}
              alt={`service-${index}`}
              className="w-full h-44 object-cover flex-shrink-0 snap-center"
            />
          ))}
        </div>
      ) : (
        <div className="w-full h-44 bg-black/30 flex items-center justify-center text-gray-500 text-sm">
          No Image Available
        </div>
      )}

      {/* CONTENT */}
      <div className="p-6">
        {/* Provider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
            <img
              src={
                service.providerId?.image?.url || "/Profile_Image.jpg"
              }
              alt="provider"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="font-bold text-sm text-white">
              {service.providerId?.name || "Unknown Provider"}
            </div>
            <div className="text-gray-400 text-xs">
              {service.categoryId?.name || "Category"}
            </div>
          </div>
        </div>

        {/* Service Name */}
        <h4 className="font-semibold text-lg text-white mb-1 line-clamp-1">
          {service.name}
        </h4>

        {/* Description */}
        <p className="text-gray-500 text-xs mb-3 line-clamp-2">
          {service.description}
        </p>

        {/* Price */}
        <p className="text-sm font-semibold text-white">
          ₹{service.price}
          <span className="text-gray-500 text-xs font-normal">
            {" "}
            / visit
          </span>
        </p>

        {/* Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/service/${service._id}`);
          }}
          className="w-full mt-4 border border-highlight text-highlight rounded-xl py-2 text-xs font-semibold hover:bg-highlight/10 hover:text-white transition-colors"
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;