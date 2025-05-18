// src/components/HotelCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function HotelCard({ hotel }) {
  const navigate = useNavigate();

  const handleViewHotel = () => {
    navigate(`/hotels/${hotel.id}`);
  };

  return (
    <div className="bg-white p-4 md:p-5 rounded-xl shadow-md hover:shadow-lg transition duration-300 border border-gray-100">
      <div className="relative h-40 md:h-48 mb-3 md:mb-4 rounded-lg overflow-hidden">
        <img
          src={
            hotel.image ||
            `https://source.unsplash.com/random/400x300/?hotel,${hotel.name}`
          }
          alt={hotel.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 md:p-4">
          <h3 className="text-lg md:text-xl font-bold text-white">
            {hotel.name}
          </h3>
          <p className="text-blue-200 text-sm md:text-base">{hotel.location}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 line-clamp-2">
          {hotel.description}
        </p>
      </div>

      <div className="flex justify-between items-center">
        <span className="bg-yellow-400 text-gray-800 font-bold px-2 py-1 rounded-md text-xs md:text-sm">
          ⭐ {hotel.rating}
        </span>
        <button
          onClick={handleViewHotel}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-md transition duration-200"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
