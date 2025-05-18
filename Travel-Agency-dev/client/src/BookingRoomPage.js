import { useLocation } from "react-router-dom";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import CheckoutButton from './CheckoutButton';
import './App.css'

const BookingComponent = () => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const routerlocation = useLocation();
  const { bookingPayload } = routerlocation.state || {};

  useEffect(() => {
    if (bookingPayload) {
      const fetchBookingDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.post("http://127.0.0.1:8000/api/book-room/", bookingPayload);
          setBookingData(response.data);
        } catch (error) {
          console.error("Booking error:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchBookingDetails();
    }
  }, [bookingPayload]);

  return (
    <div className="booking-confirmation-container flex justify-between p-4">
      <div className="booking-details w-2/3">
        <div className="hero">
          <h1 className="text-3xl text-center mt-4">Booking Confirmation</h1>
        </div>
        {loading && <p className="text-center text-blue-600">Processing booking...</p>}

        {bookingData && (
          <div className="mt-6">
            <div className="confirmation-details">
              <p><strong>Booking Reference:</strong> {bookingData.booking.reference}</p>
              <p><strong>Client Reference:</strong> {bookingData.booking.clientReference}</p>
              <p><strong>Creation Date:</strong> {bookingData.booking.creationDate}</p>
              <p><strong>Status:</strong> {bookingData.booking.status}</p>

              {/* Hotel Information */}
              <div className="hotel-details">
                <h3>Hotel: {bookingData.booking.hotel.name}</h3>
                <p><strong>Hotel Category:</strong> {bookingData.booking.hotel.categoryName}</p>
                <p><strong>Check-In Date:</strong> {bookingData.booking.hotel.checkIn}</p>
                <p><strong>Check-Out Date:</strong> {bookingData.booking.hotel.checkOut}</p>
                <p><strong>Location:</strong> {bookingData.booking.hotel.destinationName}</p>
              </div>

              {/* Room Information */}
              <div className="room-details">
                <h4>Room: {bookingData.booking.hotel.rooms[0].name}</h4>
                <p><strong>Rate Class:</strong> {bookingData.booking.hotel.rooms[0].rates[0].rateClass}</p>
                <p><strong>Rate Comments:</strong> {bookingData.booking.hotel.rooms[0].rates[0].rateComments}</p>

                {/* Cancellation Policies */}
                <h5>Cancellation Policies:</h5>
                <ul>
                  {bookingData.booking.hotel.rooms[0].rates[0].cancellationPolicies.map((policy, index) => (
                    <li key={index}>
                      <strong>Amount:</strong> {policy.amount} <br />
                      <strong>From:</strong> {policy.from}
                    </li>
                  ))}
                </ul>

                {/* Taxes */}
                <h5>Taxes:</h5>
                <ul>
                  {bookingData.booking.hotel.rooms[0].rates[0].taxes ? (
                    bookingData.booking.hotel.rooms[0].rates[0].taxes?.taxes.map((tax, index) => (
                      <li key={index}>
                        <strong>Amount:</strong> {tax.amount} {tax.currency} <br />
                        <strong>Client Amount:</strong> {tax.clientAmount} {tax.clientCurrency}
                      </li>
                    ))
                  ) : (<p>No taxes available</p>)}
                </ul>

                {/* Total Net Amount */}
                <p><strong>Total Net Amount:</strong> {bookingData.booking.totalNet} {bookingData.booking.currency}</p>
                <p><strong>Pending Amount:</strong> {bookingData.booking.pendingAmount} {bookingData.booking.currency}</p>
              </div>

              {/* Stripe Checkout Button */}
              <CheckoutButton bookingData={bookingData} />
            </div>
          </div>
        )}
      </div>

      {/* Right Side Image */}
      <div className="right-image w-1/3 ml-4">
        <img
          src="https://images.pexels.com/photos/162031/dubai-tower-arab-khalifa-162031.jpeg?cs=srgb&dl=pexels-pixabay-162031.jpg&fm=jpg"
          alt="Hotel Image"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default BookingComponent;
