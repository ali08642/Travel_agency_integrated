import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const RoomSelectionPage = () => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1); // default 1 room
  const [adults, setAdults] = useState(2); // default 2 adults
  const [roomData, setRoomData] = useState([]); // Holds room data
  const [loading, setLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const { hotelCode } = useParams(); // Get hotel code from URL params

  const fetchRoomDetails = async () => {
    setLoading(true);
    setErrorMessage(""); // Reset error message before fetching
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/select-room/", {
        checkIn,
        checkOut,
        rooms,
        adults,
        hotelCode,
      });

      // Log the response data to check the structure
      console.log(response.data);

      // Check if the response contains the expected data
      if (response.data && response.data.hotels && response.data.hotels.hotels[0]) {
        setRoomData(response.data.hotels.hotels[0].rooms); // Assuming the rooms are in the first hotel
      } else {
        setErrorMessage("No rooms available");
        setRoomData([]); // Optional: Set an empty array if no rooms are found
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Error fetching room details");
      setRoomData([]); // Optional: Set an empty array in case of error
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const handleBookingSelect = (rateKey) => {
    navigate("/hotels/booking-form/", {
      state: {
        rateKey: rateKey, // Pass the selected rate key to the booking form
        rooms: rooms,
        adultsPerRoom: adults,
      },
    });
  };
  const goBackWithState = () => {
    navigate(-1, {
      state: {
        from: "MyComponent",  // Add any custom state to pass back to the previous page
        message: "Navigating back with state",
      },
    });
  };
  return (
    <div className="room-search-page">
      <h1>Display Rooms</h1>
      <form onSubmit={(e) => { e.preventDefault(); fetchRoomDetails(); }}>
        <label>Check-in Date</label>
        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />

        <label>Check-out Date</label>
        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />

        <label>Rooms</label>
        <input type="number" value={rooms} onChange={(e) => setRooms(Number(e.target.value))} />

        <label>Adults</label>
        <input type="number" value={adults} onChange={(e) => setAdults(Number(e.target.value))} />

        <button type="submit">Get Room Details</button>
      </form>

      {loading && <p>Loading...</p>}
      {errorMessage && <p>{errorMessage}</p>} {/* Display error message */}

      <div className="room-list">
        {roomData.length > 0 ? (
          roomData.map((room, index) => (
            <div key={room.code} className="room-card">
              <h2>{room.name}</h2>
              <p>Rate: minimum Rate {room.minRate}   Maximum Rate {room.maxRate}  Currency {room.currency}</p>
              <div className="rates">
                {room.rates.slice(0, 2).map((rate, rateIndex) => (  // Displaying only the first two rates
                  <div key={rateIndex} className="rate">
                    <p><strong>Rate Type:</strong> {rate.rateType}</p>
                    <p><strong>Net Rate:</strong> {rate.net}</p>
                    <p><strong>Payment Type:</strong> {rate.paymentType}</p>
                    <p><strong>Cancellation Policy: Amount:</strong> {rate.cancellationPolicies[0]?.amount}</p>
                    <p><strong>Cancellation Date:</strong> {rate.cancellationPolicies[0]?.from}</p>

                    {/* Select Room Button */}
                    <button
                        className="select-room-button"
                        onClick={() => handleBookingSelect(rate.rateKey)}
                    >
                        Select Room
                    </button>

                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No rooms available</p> // Show if no rooms are found
        )}
      </div>
      <div>
        <button onClick={goBackWithState}>Go Back</button>
      </div>
    </div>
  );
};

export default RoomSelectionPage;
