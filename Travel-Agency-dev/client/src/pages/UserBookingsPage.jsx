import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserFlightBookings, cancelFlightBooking } from "../api/flights";
import { getUserHotelBookings, cancelHotelBooking } from "../api/hotels";
import { useAuth } from "../auth/AuthContext";
import { format, parseISO, isToday, isPast, isFuture } from "date-fns";
import Swal from "sweetalert2";

export default function UserBookingsPage() {
  const [flightBookings, setFlightBookings] = useState([]);
  const [hotelBookings, setHotelBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const loadBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const [flights, hotels] = await Promise.all([
          getUserFlightBookings(),
          getUserHotelBookings(),
        ]);

        setFlightBookings(flights);
        setHotelBookings(hotels);
      } catch (err) {
        setError(err.message || "Failed to load bookings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user, navigate]);

  const handleCancelFlightBooking = async (flightId) => {
    const result = await Swal.fire({
      title: "Cancel Flight Booking?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Processing...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        await cancelFlightBooking(flightId);
        const updatedFlights = await getUserFlightBookings();
        setFlightBookings(updatedFlights);

        Swal.fire(
          "Cancelled!",
          "Your flight booking has been cancelled.",
          "success"
        );
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  const handleCancelHotelBooking = async (bookingId) => {
    const result = await Swal.fire({
      title: "Cancel Hotel Booking?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, cancel it!",
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Processing...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        await cancelHotelBooking(bookingId);
        const updatedHotels = await getUserHotelBookings();
        setHotelBookings(updatedHotels);

        Swal.fire(
          "Cancelled!",
          "Your hotel booking has been cancelled.",
          "success"
        );
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  const categorizeBookings = (bookings, type) => {
    const getDate = (booking) =>
      type === "flight"
        ? parseISO(booking.departure_time)
        : parseISO(booking.check_in);

    return {
      today: bookings.filter((booking) => isToday(getDate(booking))),
      upcoming: bookings.filter((booking) => isFuture(getDate(booking))),
      past: bookings.filter((booking) => isPast(getDate(booking))),
    };
  };

  const flightCategories = categorizeBookings(flightBookings, "flight");
  const hotelCategories = categorizeBookings(hotelBookings, "hotel");

  const BookingCard = ({ booking, type }) => {
    const isFutureBooking =
      type === "flight"
        ? isFuture(parseISO(booking.departure_time))
        : isFuture(parseISO(booking.check_in));

    const formatBookingDate = (dateString) =>
      format(parseISO(dateString), "MMM d, yyyy h:mm a");

    return (
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border border-gray-100">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {type === "flight"
              ? `${booking.origin} → ${booking.destination}`
              : `${booking.room_type} at ${booking.hotel_name}`}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isFutureBooking
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {isFutureBooking ? "Upcoming" : "Completed"}
          </span>
        </div>

        <p className="text-gray-600 mb-2">
          {type === "flight"
            ? `Flight #${booking.flight_number}`
            : `Room #${booking.room_number}`}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <p className="text-gray-500">
              {type === "flight" ? "Departure" : "Check-in"}
            </p>
            <p>
              {formatBookingDate(
                type === "flight" ? booking.departure_time : booking.check_in
              )}
            </p>
          </div>
          <div>
            <p className="text-gray-500">
              {type === "flight" ? "Arrival" : "Check-out"}
            </p>
            <p>
              {formatBookingDate(
                type === "flight" ? booking.arrival_time : booking.check_out
              )}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-blue-600 font-bold">
            {booking.currency} {booking.total_price}
          </p>
          {isFutureBooking && (
            <button
              onClick={() =>
                type === "flight"
                  ? handleCancelFlightBooking(booking.id)
                  : handleCancelHotelBooking(booking.id)
              }
              className="text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    );
  };

  const BookingSection = ({ title, bookings, type }) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} type={type} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-2">No {type} bookings found</p>
          <button
            onClick={() => navigate(type === "flight" ? "/flights" : "/hotels")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Book a {type} now
          </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-t-2 border-b-2 border-blue-600 rounded-full"></div>
          <p className="mt-2 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center max-w-md mx-4">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          My Bookings
        </h1>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Flights</h2>
          <BookingSection
            title="Today's Flights"
            bookings={flightCategories.today}
            type="flight"
          />
          <BookingSection
            title="Upcoming Flights"
            bookings={flightCategories.upcoming}
            type="flight"
          />
          <BookingSection
            title="Past Flights"
            bookings={flightCategories.past}
            type="flight"
          />
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Hotels</h2>
          <BookingSection
            title="Today's Stays"
            bookings={hotelCategories.today}
            type="hotel"
          />
          <BookingSection
            title="Upcoming Stays"
            bookings={hotelCategories.upcoming}
            type="hotel"
          />
          <BookingSection
            title="Past Stays"
            bookings={hotelCategories.past}
            type="hotel"
          />
        </div>
      </div>
    </div>
  );
}
