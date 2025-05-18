import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchHotelDetails, createReview } from "../api/hotels";
import { useAuth } from "../auth/AuthContext";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import HotelRoomsPreview from "../components/HotelRoomsPreview";
import Swal from "sweetalert2";

export default function HotelDetailsPage() {
  const { hotel_id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHotel = async () => {
      try {
        const data = await fetchHotelDetails(hotel_id);
        setHotel(data);
      } catch (err) {
        setError(err.message || "Failed to load hotel details");
      } finally {
        setLoading(false);
      }
    };

    loadHotel();
  }, [hotel_id]);

  const handleSubmitReview = async (rating, comment) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await createReview(hotel_id, rating, comment);
      Swal.fire("Success", "Your review has been submitted!", "success");
      // Refresh hotel data to show new review
      const updatedHotel = await fetchHotelDetails(hotel_id);
      setHotel(updatedHotel);
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to submit review", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-t-2 border-b-2 border-blue-600 rounded-full"></div>
          <p className="mt-2 text-gray-600">Loading hotel details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Hotel not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Hotel Hero Image */}
        <div className="relative h-64 md:h-96">
          <img
            src={
              hotel.image ||
              `https://source.unsplash.com/random/1200x600/?hotel,${hotel.name}`
            }
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
          <div className="absolute bottom-0 left-0 p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {hotel.name}
            </h1>
            <p className="text-blue-200 mt-2">{hotel.location}</p>
            <div className="mt-4 flex items-center">
              <span className="bg-yellow-400 text-gray-800 font-bold px-3 py-1 rounded-full text-sm">
                ⭐ {hotel.rating || "4.5"}
              </span>
            </div>
          </div>
        </div>

        {/* Hotel Details */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-4">About This Hotel</h2>
              <p className="text-gray-700 mb-6">{hotel.description}</p>

              <h2 className="text-2xl font-bold mb-4">Rooms</h2>
              <HotelRoomsPreview hotelId={hotel_id} />

              <h2 className="text-2xl font-bold mt-8 mb-4">Reviews</h2>
              {hotel.reviews && hotel.reviews.length > 0 ? (
                <ReviewList reviews={hotel.reviews} />
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {user && (
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                  <ReviewForm onSubmit={handleSubmitReview} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
