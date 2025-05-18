import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import './HotelSearchPage.css'; // Assuming we add a CSS file too
import './App.css'

const HotelSearchPage = () => {
  const [countryCode, setCountryCode] = useState("");
  const [destinationCode, setDestinationCode] = useState("");
  const [language, setLanguage] = useState("ENG");
  const [fromRecord, setFromRecord] = useState(1);
  const [toRecord, setToRecord] = useState(10);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHotelImages, setSelectedHotelImages] = useState([]);

  const navigate = useNavigate();

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/search-hotels/", {
        country_code: countryCode,
        destination_code: destinationCode,
        language,
        from_record: fromRecord,
        to_record: toRecord,
      });
      setHotels(response.data.hotels);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSelect = (hotelCode) => {
    navigate(`/hotels/room/${hotelCode}`);
  };

  const baseImageUrl = "https://photos.hotelbeds.com/giata/";

  const openModal = (images) => {
    setSelectedHotelImages(images);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedHotelImages([]);
  };
  const location = useLocation();
  console.log(location.state);
  
  return (
    <div className="hotel-search-page">
      <h1>Hotel Booking</h1>
      <form className="search-form" onSubmit={(e) => { e.preventDefault(); fetchHotels(); }}>
        <input type="text" placeholder="Country Code" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} />
        <input type="text" placeholder="Destination Code" value={destinationCode} onChange={(e) => setDestinationCode(e.target.value)} />
        <input type="text" placeholder="Language" value={language} onChange={(e) => setLanguage(e.target.value)} />
        <input type="number" placeholder="From Record" value={fromRecord} onChange={(e) => setFromRecord(Number(e.target.value))} />
        <input type="number" placeholder="To Record" value={toRecord} onChange={(e) => setToRecord(Number(e.target.value))} />
        <button type="submit">Search Hotels</button>
      </form>

      {loading && <p>Loading hotels...</p>}

      <div className="hotel-list">
        {hotels.map((hotel) => (
          <div key={hotel.code} className="hotel-card">
            {hotel.images && hotel.images.length > 0 ? (
              <img
                src={`${baseImageUrl}${hotel.images[0].path}`}
                alt={hotel.name.content}
                className="hotel-image"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/150"; }}
              />
            ) : (
              <img src="https://via.placeholder.com/150" alt="Placeholder image for hotel" className="hotel-image" />
            )}
            <h3>{hotel.name.content}</h3>
            {hotel.ranking && <p>Ranking: {hotel.ranking}</p>}

            <button className="details-btn" onClick={() => openModal(hotel.images)}>Load More Images</button>

            {hotel.description?.content && (
              <details>
                <summary>Description</summary>
                <p>{hotel.description.content}</p>
              </details>
            )}

            <details>
              <summary>Location</summary>
              <p>Longitude: {hotel.coordinates.longitude}, Latitude: {hotel.coordinates.latitude}</p>
            </details>

            {hotel.email && (
              <details>
                <summary>Email</summary>
                <p>{hotel.email}</p>
              </details>
            )}

            {hotel.phones && hotel.phones.length > 0 && (
              <details>
                <summary>Phone</summary>
                <p>{hotel.phones[0].phoneNumber}</p>
              </details>
            )}

            {hotel.web && (
              <details>
                <summary>Website</summary>
                <p>{hotel.web}</p>
              </details>
            )}

            <button className="select-room-btn" onClick={() => handleRoomSelect(hotel.code)}>Select Room</button>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={closeModal} className="close-btn">Close</button>
            {selectedHotelImages.map((image, index) => (
              <img key={index} src={`${baseImageUrl}${image.path}`} alt="Hotel" className="modal-image" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelSearchPage;
