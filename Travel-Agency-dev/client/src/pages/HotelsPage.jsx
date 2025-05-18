import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHotels } from "../api/hotels";
import HotelCard from "../components/HotelCard";
import hotelImage from "../assets/hotels.jpeg";
import { useAuth } from "../auth/AuthContext";

export default function HotelsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [allHotels, setAllHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    location: "",
    minRating: 0,
  });

  const loadHotels = async () => {
    try {
      const data = await fetchHotels();
      console.log("API data:", data);

      if (Array.isArray(data.results)) {
        setAllHotels(data.results);
        setFilteredHotels(data.results);
      } else {
        setError("API returned unexpected data format.");
      }
    } catch (err) {
      setError("Failed to load hotels. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const handleSearch = () => {
    try {
      let results = [...allHotels];

      if (filters.location) {
        const searchTerm = filters.location.toLowerCase();
        results = results.filter(
          (hotel) =>
            hotel.name.toLowerCase().includes(searchTerm) ||
            hotel.location.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.minRating > 0) {
        results = results.filter((hotel) => hotel.rating >= filters.minRating);
      }

      setFilteredHotels(results);
    } catch (err) {
      setError("Failed to filter hotels. Please try again.");
    }
  };

  const handleViewHotel = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="relative h-64 mb-8 rounded-xl overflow-hidden">
        <img
          src={hotelImage}
          alt="Hotels"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-600 opacity-80"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
            Find Your Perfect Stay
          </h1>
          <p className="mt-2 text-lg md:text-xl text-white drop-shadow-md">
            Experience luxury, comfort, and unforgettable memories.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Search Hotels:</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location (Name or City)
            </label>
            <input
              type="text"
              placeholder="Search by hotel name or city"
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Rating
            </label>
            <select
              value={filters.minRating}
              onChange={(e) =>
                setFilters({ ...filters, minRating: Number(e.target.value) })
              }
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>Any Rating</option>
              <option value={3}>3+ Stars</option>
              <option value={4}>4+ Stars</option>
              <option value={5}>5 Stars</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200 flex items-center"
          >
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
            Search Hotels
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading hotels...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-blue-600 hover:underline"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            {filteredHotels.length
              ? `Found ${filteredHotels.length} hotels`
              : "No hotels match your search"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(filteredHotels) &&
              filteredHotels.map((hotel, index) => (
                <HotelCard
                  key={hotel.id}
                  index={index + 1}
                  hotel={hotel}
                  onViewDetails={() => handleViewHotel(hotel.id)}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
