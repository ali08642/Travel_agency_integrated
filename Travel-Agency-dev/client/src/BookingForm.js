import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const BookingForm = ({ onSubmit }) => {
  const location = useLocation();
  const { rateKey, rooms, adultsPerRoom } = location.state || {};
  const [form, setForm] = useState({
    holderName: '',
    holderSurname: '',
    rooms: rooms,
    adultsPerRoom: adultsPerRoom,
    pax: [['', '']],
    remark: '',
    clientReference: 'IntegrationAgency',
    tolerance: 2,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaxChange = (roomIndex, paxIndex, field, value) => {
    const updatedPax = [...form.pax];
    if (!updatedPax[roomIndex]) updatedPax[roomIndex] = [];
    if (!updatedPax[roomIndex][paxIndex]) updatedPax[roomIndex][paxIndex] = ['', ''];
    updatedPax[roomIndex][paxIndex][field === 'name' ? 0 : 1] = value;
    setForm((prev) => ({ ...prev, pax: updatedPax }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const rooms = Array.from({ length: parseInt(form.rooms) }, (_, i) => ({
      rateKey,
      paxes: Array.from({ length: parseInt(form.adultsPerRoom) }, (_, j) => ({
        roomId: i + 1,
        type: 'AD',
        name: form.pax[i]?.[j]?.[0] || '',
        surname: form.pax[i]?.[j]?.[1] || '',
      }))
    }));

    const bookingPayload = {
      holder: {
        name: form.holderName,
        surname: form.holderSurname,
      },
      rooms,
      clientReference: form.clientReference,
      remark: form.remark,
      tolerance: form.tolerance,
    };

    navigate('/hotels/booking-room', { state: { bookingPayload } });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="hero">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw_G7IeAJlFxoT9qUr5lL0bz6fmPHkppT0zA&s" alt="Hotel Booking" className="w-full h-auto" />
        <h1 className="text-3xl text-center mt-4">Book Your Stay</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 mt-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            name="holderName"
            value={form.holderName}
            onChange={handleChange}
            placeholder="Holder First Name"
            className="border p-2 rounded"
            required
          />
          <input
            name="holderSurname"
            value={form.holderSurname}
            onChange={handleChange}
            placeholder="Holder Last Name"
            className="border p-2 rounded"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            name="rooms"
            type="number"
            min="1"
            value={form.rooms}
            onChange={handleChange}
            placeholder="Number of Rooms"
            className="border p-2 rounded"
            required
          />
          <input
            name="adultsPerRoom"
            type="number"
            min="1"
            value={form.adultsPerRoom}
            onChange={handleChange}
            placeholder="Adults per Room"
            className="border p-2 rounded"
            required
          />
        </div>
        {Array.from({ length: parseInt(form.rooms) }, (_, i) => (
          <div key={i} className="border-t pt-4">
            <h3 className="font-semibold">Room {i + 1}</h3>
            {Array.from({ length: parseInt(form.adultsPerRoom) }, (_, j) => (
              <div key={j} className="grid grid-cols-2 gap-4 mb-2">
                <input
                  placeholder={`Pax ${j + 1} First Name`}
                  value={form.pax[i]?.[j]?.[0] || ''}
                  onChange={(e) => handlePaxChange(i, j, 'name', e.target.value)}
                  className="border p-2 rounded"
                  required
                />
                <input
                  placeholder={`Pax ${j + 1} Last Name`}
                  value={form.pax[i]?.[j]?.[1] || ''}
                  onChange={(e) => handlePaxChange(i, j, 'surname', e.target.value)}
                  className="border p-2 rounded"
                  required
                />
              </div>
            ))}
          </div>
        ))}
        <textarea
          name="remark"
          value={form.remark}
          onChange={handleChange}
          placeholder="Remarks (optional)"
          className="border p-2 rounded w-full"
          rows={3}
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Submit Booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
