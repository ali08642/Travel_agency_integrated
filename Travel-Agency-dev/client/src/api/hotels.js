import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const getAuthHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
};

export const fetchHotels = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/hotels/`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching hotels:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to fetch hotels");
  }
};

export const fetchHotelDetails = async (hotelId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/hotels/${hotelId}/`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching hotel details:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch hotel details"
    );
  }
};

export const fetchHotelRooms = async (hotelId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/hotels/${hotelId}/rooms/`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching hotel rooms:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch hotel rooms"
    );
  }
};

export const bookRoom = async (hotelId, roomId, checkIn, checkOut) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/hotels/${hotelId}/rooms/${roomId}/booking/`,
      { check_in: checkIn, check_out: checkOut },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error booking room:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to book room");
  }
};

export const getUserHotelBookings = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/hotels/bookings/`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching hotel bookings:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch hotel bookings"
    );
  }
};

export const cancelHotelBooking = async (bookingId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/hotels/bookings/${bookingId}/`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error cancelling hotel booking:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to cancel hotel booking"
    );
  }
};

// Add the missing createReview export
export const createReview = async (hotelId, rating, comment) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/hotels/${hotelId}/reviews/`,
      { rating, comment },
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating review:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to create review");
  }
};
