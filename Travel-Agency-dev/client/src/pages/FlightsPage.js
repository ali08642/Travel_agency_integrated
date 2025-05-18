import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FlightCard from "../components/FlightCard";
import flightsImage from "../assets/flights.jpeg";
import { searchFlights } from "../api/flights";
import { useAuth } from "../auth/AuthContext";

export default function FlightsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    originLocationCode: "LHR",
    destinationLocationCode: "THR",
    departureDate: "",
    adults: 1,
  });

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchFlights(filters);
      setFlights(data.data || []);
    } catch (err) {
      setError("Failed to load flights. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (flight) => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate(`/book-flight`, { state: { flight } });
  };

  // Format flight duration
  const formatDuration = (duration) => {
    return duration.replace(/PT|H|M/g, (match) => {
      if (match === "PT") return "";
      if (match === "H") return "h ";
      if (match === "M") return "m";
      return match;
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section (unchanged) */}
      <div className="relative h-64 mb-8 rounded-xl overflow-hidden">
        <img
          src={flightsImage}
          alt="Airplane flying"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 opacity-80"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            Explore the World
          </h1>
          <p className="mt-2 text-lg md:text-xl text-white drop-shadow-md">
            Find and book your perfect flight to any destination around the
            globe.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Search Flights:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <input
              type="text"
              placeholder="Airport"
              value={filters.originLocationCode}
              onChange={(e) =>
                setFilters({ ...filters, originLocationCode: e.target.value })
              }
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              type="text"
              placeholder="Airport"
              value={filters.destinationLocationCode}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  destinationLocationCode: e.target.value,
                })
              }
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure
            </label>
            <input
              type="date"
              value={filters.departureDate}
              onChange={(e) =>
                setFilters({ ...filters, departureDate: e.target.value })
              }
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passengers
            </label>
            <select
              value={filters.adults}
              onChange={(e) =>
                setFilters({ ...filters, adults: e.target.value })
              }
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "Adult" : "Adults"}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200 flex items-center"
            disabled={loading}
          >
            {loading ? (
              "Searching..."
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Search Flights
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading flights...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <button
            onClick={handleSearch}
            className="mt-4 text-blue-600 hover:underline"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {flights.length ? "Available Flights" : "No flights found"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flights.map((flight) => {
              const firstSegment = flight.itineraries[0].segments[0];
              const lastSegment =
                flight.itineraries[0].segments[
                  flight.itineraries[0].segments.length - 1
                ];
              const price = flight.price.grandTotal;
              const currency = flight.price.currency;

              return (
                <FlightCard
                  key={flight.id}
                  flight={{
                    id: flight.id,
                    airline: firstSegment.carrierCode,
                    flightNumber: firstSegment.number,
                    from: firstSegment.departure.iataCode,
                    to: lastSegment.arrival.iataCode,
                    departureTime: firstSegment.departure.at,
                    arrivalTime: lastSegment.arrival.at,
                    duration: formatDuration(flight.itineraries[0].duration),
                    price: price,
                    currency: currency,
                    data: flight, // Pass full flight data for booking
                  }}
                  onBookNow={() => handleBookNow(flight)}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
