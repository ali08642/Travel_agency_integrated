import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFlightDetails } from "../api/flights";
import { useAuth } from "../auth/AuthContext";
import { format } from "date-fns";

export default function BookingDetailsPage() {
  const { flight_id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [flightDetails, setFlightDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchDetails = async () => {
      try {
        const data = await getFlightDetails(flight_id);
        setFlightDetails(data.data || data); // backend may wrap inside 'data'
      } catch (err) {
        setError("Failed to load booking details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [flight_id, user, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading booking details...</p>
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
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!flightDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">No booking details found.</p>
      </div>
    );
  }

  const flightOffer = flightDetails.flightOffers
    ? flightDetails.flightOffers[0]
    : null;

  const formatDuration = (duration) => {
    return duration
      .replace("PT", "")
      .replace("H", "h ")
      .replace("M", "m")
      .toLowerCase();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-xl p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Booking Details
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side - Flight Info */}
          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              Flight Information
            </h2>
            {flightOffer ? (
              <>
                <p>
                  <strong>Origin:</strong>{" "}
                  {flightOffer.itineraries[0].segments[0].departure.iataCode}
                </p>
                <p>
                  <strong>Destination:</strong>{" "}
                  {flightOffer.itineraries[0].segments[0].arrival.iataCode}
                </p>
                <p>
                  <strong>Departure:</strong>{" "}
                  {format(
                    new Date(
                      flightOffer.itineraries[0].segments[0].departure.at
                    ),
                    "MMM d, yyyy h:mm a"
                  )}
                </p>
                <p>
                  <strong>Arrival:</strong>{" "}
                  {format(
                    new Date(flightOffer.itineraries[0].segments[0].arrival.at),
                    "MMM d, yyyy h:mm a"
                  )}
                </p>
                <p>
                  <strong>Duration:</strong>{" "}
                  {formatDuration(flightOffer.itineraries[0].duration)}
                </p>
                <p>
                  <strong>Carrier:</strong>{" "}
                  {flightOffer.itineraries[0].segments[0].carrierCode}
                </p>
                <p>
                  <strong>Flight Number:</strong>{" "}
                  {flightOffer.itineraries[0].segments[0].number}
                </p>
              </>
            ) : (
              <p>No flight details available.</p>
            )}
          </div>

          {/* Right Side - Payment Info */}
          <div>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">
              Payment Information
            </h2>
            {flightOffer && (
              <>
                <p>
                  <strong>Price:</strong> {flightOffer.price.grandTotal}{" "}
                  {flightOffer.price.currency}
                </p>
              </>
            )}
            <p>
              <strong>Booking ID:</strong> {flightDetails.id}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {flightDetails.status ? flightDetails.status : "Pending"}
            </p>
            <p>
              <strong>Payment Status:</strong>{" "}
              {flightDetails.associatedRecords ? "Paid" : "Pending"}
            </p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/booking")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition"
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    </div>
  );
}
