import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { bookRoom } from "../api/hotels";
import { useAuth } from "../auth/AuthContext";
import Swal from "sweetalert2";

export default function HotelRoomBookingPage() {
  const { hotel_id, room_id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    check_in: "",
    check_out: "",
  });

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!formData.check_in || !formData.check_out) {
      Swal.fire(
        "Error",
        "Please select both check-in and check-out dates.",
        "error"
      );
      return;
    }

    try {
      const bookingResponse = await bookRoom(
        hotel_id,
        room_id,
        formData.check_in,
        formData.check_out
      );
      window.location.href = bookingResponse.checkout_url;
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Booking failed. Please try again.", "error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Book Your Room
        </h2>

        <form onSubmit={handleBooking} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Check-in Date
            </label>
            <input
              type="date"
              name="check_in"
              value={formData.check_in}
              onChange={(e) =>
                setFormData({ ...formData, check_in: e.target.value })
              }
              min={new Date().toISOString().split("T")[0]}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Check-out Date
            </label>
            <input
              type="date"
              name="check_out"
              value={formData.check_out}
              onChange={(e) =>
                setFormData({ ...formData, check_out: e.target.value })
              }
              min={formData.check_in}
              required
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            Confirm & Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
}
