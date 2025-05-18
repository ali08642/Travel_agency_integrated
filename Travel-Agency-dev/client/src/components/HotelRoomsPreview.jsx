// src/components/HotelRoomsPreview.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHotelRooms } from "../api/hotels";

export default function HotelRoomsPreview({ hotelId }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchHotelRooms(hotelId);
        setRooms(data.results.slice(0, 3)); // Show only 3 rooms as preview
      } catch (err) {
        console.error("Error loading rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [hotelId]);

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin inline-block w-6 h-6 border-t-2 border-b-2 border-blue-600 rounded-full"></div>
      </div>
    );
  }

  if (rooms.length === 0) {
    return <p className="text-gray-500">No rooms available.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
          >
            <img
              src={
                room.image ||
                `https://source.unsplash.com/random/400x300/?hotelroom`
              }
              alt={room.room_type}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg">{room.room_type}</h3>
              <p className="text-blue-600 font-bold">
                {room.price_per_night}Rs/-
              </p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate(`/hotels/${hotelId}/rooms`)}
        className="text-blue-600 hover:text-blue-800 font-medium"
      >
        View all rooms →
      </button>
    </div>
  );
}
