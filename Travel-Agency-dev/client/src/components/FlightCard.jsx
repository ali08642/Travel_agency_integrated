import React from "react";
import { format } from "date-fns";

export default function FlightCard({ flight, onBookNow }) {
  const formatTime = (dateTime) => {
    return format(new Date(dateTime), "hh:mm a");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-gray-800">
          {flight.airline} {flight.flightNumber}
        </h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
          Economy
        </span>
      </div>

      <div className="flex justify-between mb-4">
        <div>
          <p className="font-medium">{flight.from}</p>
          <p className="text-gray-500 text-sm">
            {formatTime(flight.departureTime)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">{flight.duration}</p>
          <div className="w-16 h-px bg-gray-300 my-2 mx-auto"></div>
          <p className="text-xs text-gray-500">Non-stop</p>
        </div>
        <div>
          <p className="font-medium">{flight.to}</p>
          <p className="text-gray-500 text-sm">
            {formatTime(flight.arrivalTime)}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <div>
          <p className="text-2xl font-bold text-blue-600">
            {flight.currency} {flight.price}
          </p>
          <p className="text-xs text-gray-500">Total price</p>
        </div>
        <button
          onClick={onBookNow}
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-md transition duration-200"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
