import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51RFx4RB2lv7ZjJ3AvLekDHvnDVfZ2knFs9EpBNFzKQ7JnwfO0KlyFaxclDRaEfNSMlueadokTUE3MIU7FskA2c1J00jWJvqr2Z');  // Replace with your publishable key

const CheckoutButton = ({ bookingData }) => {
    const handleClick = async (event) => {
        const stripe = await stripePromise;
        try {
            // Send booking data to backend to create checkout session
            const response = await fetch('http://127.0.0.1:8000/api/process-booking/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),  
            });

            const session = await response.json();  // Parse the response body only once

            if (session.error) {
                console.error(session.error);
                return;
            }

    
            if (session.url) {
                window.location.href = session.url; 
            }

            // Redirect to Stripe Checkout with sessionId
            const result = await stripe.redirectToCheckout({
                sessionId: session.sessionId,
            });

            if (result.error) {
                console.error(result.error.message);
            }
        } catch (error) {
            console.error("Error processing booking:", error);
        }
    };

    return (
      <div>
        <h1>Booking Confirmation</h1>
        <p>Hotel: {bookingData.booking.hotel.name}</p>
        <p>Amount: ${bookingData.booking.pendingAmount}</p>
        <button onClick={handleClick}>Pay Now</button>
      </div>
    );
};

export default CheckoutButton;
