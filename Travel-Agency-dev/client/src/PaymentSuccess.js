// src/PaymentSuccess.js
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setError('Session ID missing in URL');
      return;
    }

    fetch(`http://127.0.0.1:8000/api/payment/success/?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setBookingData(data);
        }
      })
      .catch((err) => setError('Something went wrong: ' + err.message));
  }, [searchParams]);

  return (
    <div style={styles.container}>
      {error ? (
        <div style={styles.errorBox}>
          <h2>Payment Failed</h2>
          <p>{error}</p>
        </div>
      ) : bookingData ? (
        <div style={styles.successBox}>
          <h2>🎉 Payment Successful!</h2>
          <p><strong>Reference:</strong> {bookingData.booking_reference}</p>
          <p><strong>Hotel:</strong> {bookingData.hotel_name}</p>
          <p><strong>Check-in:</strong> {bookingData.check_in}</p>
          <p><strong>Check-out:</strong> {bookingData.check_out}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
  },
  successBox: {
    backgroundColor: '#e6ffed',
    padding: '2rem',
    borderRadius: '10px',
    border: '1px solid #28a745',
    color: '#155724',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  errorBox: {
    backgroundColor: '#ffe6e6',
    padding: '2rem',
    borderRadius: '10px',
    border: '1px solid #dc3545',
    color: '#721c24',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  }
};

export default PaymentSuccess;
