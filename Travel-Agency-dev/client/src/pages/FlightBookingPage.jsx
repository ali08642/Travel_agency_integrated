import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { bookFlight } from "../api/flights";

export default function FlightBookingPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const flight = state?.flight;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
    nationality: "Pakistan",
    passportNo: "",
  });

  const [travellers, setTravellers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(flight)
    if (!flight) {
      navigate("/flights");
    }
  }, [flight, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddTraveller = () => {
    const newTraveller = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      gender: formData.gender,
      nationality: formData.nationality,
      passport_no: formData.passportNo,
      date_of_birth: formData.dateOfBirth,
      passenger_type: "adult",
    };

    setTravellers((prev) => [...prev, newTraveller]);

    // Clear the form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "male",
      nationality: "Pakistan",
      passportNo: "",
    });

    Swal.fire({
      icon: "success",
      title: "Traveller Added",
      text: `${newTraveller.first_name} ${newTraveller.last_name} has been added.`,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      if (travellers.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "No travellers added",
          text: "Please add at least one traveller before booking.",
        });
        setLoading(false);
        return;
      }
  
      // Open a blank tab early
      const newTab = window.open('', '_blank');
  
      const bookingResponse = await bookFlight(flight, travellers);
  
      // Redirect the new tab to Stripe payment URL
      newTab.location.href = bookingResponse.payment_url.url;
    } catch (error) {
      console.error("Booking error:", error);
      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: error.response?.data?.error || "An error occurred during booking",
      });
    } finally {
      setLoading(false);
    }
  };
  

  if (!flight) return null;

  const firstSegment = flight.itineraries[0].segments[0];
  const lastSegment =
    flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];
  const price = flight.price.grandTotal;
  const currency = flight.price.currency;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {firstSegment.departure.iataCode} → {lastSegment.arrival.iataCode}
            </h2>
            <p className="text-blue-600 text-lg font-semibold">
              {currency} {price}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {firstSegment.carrierCode} • Flight #{firstSegment.number}
            </p>
          </div>
          <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            Economy
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Traveller input form */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="transgender">Transgender</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Nationality
            </label>
            <input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Passport Number
            </label>
            <input
              type="text"
              name="passportNo"
              value={formData.passportNo}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          <button
            type="button"
            onClick={handleAddTraveller}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Add Traveller
          </button>

          {/* Display added travellers */}
          {travellers.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Added Travellers:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {travellers.map((traveller, index) => (
                  <li key={index}>
                    {traveller.first_name} {traveller.last_name} ({traveller.passport_no})
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-lg transition duration-200 mt-6"
          >
            {loading ? "Processing..." : "Confirm Booking & Pay"}
          </button>
        </form>
      </div>
    </div>
  );
}
