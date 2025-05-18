import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchHotelRooms, bookRoom } from "../api/hotels";
import Swal from "sweetalert2";

export default function HotelRoomsPage() {
  const { hotel_id } = useParams();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchHotelRooms(hotel_id);
        setRooms(data.results);
      } catch (err) {
        setError("Failed to load rooms. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [hotel_id]);

  const handleBooking = async (roomId) => {
    const { value: formValues } = await Swal.fire({
      title: "Enter Booking Details",
      html:
        '<input id="checkin" type="date" class="swal2-input" placeholder="Check-in date">' +
        '<input id="checkout" type="date" class="swal2-input" placeholder="Check-out date">',
      focusConfirm: false,
      preConfirm: () => {
        return {
          checkIn: document.getElementById("checkin").value,
          checkOut: document.getElementById("checkout").value,
        };
      },
    });

    if (!formValues || !formValues.checkIn || !formValues.checkOut) {
      Swal.fire(
        "Error",
        "Please fill in both check-in and check-out dates.",
        "error"
      );
      return;
    }

    try {
      const booking = await bookRoom(
        hotel_id,
        roomId,
        formValues.checkIn,
        formValues.checkOut
      );
      window.open(booking.checkout_url, "_blank");
    } catch (err) {
      Swal.fire("Error", "Failed to create booking.", "error");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Available Rooms</h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading rooms...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : rooms.length === 0 ? (
        <div className="text-center text-gray-600">No rooms available</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white p-6 rounded-lg shadow-md border hover:shadow-lg transition"
            >
              <img
                src={
                  room.image ||
                  `https://source.unsplash.com/random/400x300/?room`
                }
                alt={room.room_type}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h2 className="text-xl font-bold">{room.room_type}</h2>
              <p className="text-blue-600 font-semibold mb-2">
                {room.price_per_night}Rs/- per night
              </p>
              <button
                onClick={() => handleBooking(room.id)}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-md transition"
              >
                Book Room
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
