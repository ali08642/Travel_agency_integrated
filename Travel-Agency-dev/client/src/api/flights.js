import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const getAuthHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  };
};

export const searchFlights = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/flights`, {
      params,
      ...getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error searching flights:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to search flights"
    );
  }
};

export const bookFlight = async (flightData, travellers) => {
  try {
    
    const response = await axios.post(
      `${API_BASE_URL}/api/flights/booking/`,
      { flight_data: flightData, travellers: travellers },
      getAuthHeaders()
    );
    console.log(flightData)
    return response.data;
  } catch (error) {
    console.error(
      "Error booking flight:",
      error.response?.data || error.message
    );
    throw new Error(error.response?.data?.message || "Failed to book flight");
  }
};

export const getFlightDetails = async (flightId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/flights/booking/list/${flightId}/`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error getting flight details:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to get flight details"
    );
  }
};

export const getUserFlightBookings = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/flights/booking/list/`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching flight bookings:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch flight bookings"
    );
  }
};

export const cancelFlightBooking = async (flightId) => {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/api/flights/booking/cancel/`,
      {
        ...getAuthHeaders(),
        params: { flight_id: flightId },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error cancelling flight booking:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to cancel flight booking"
    );
  }
};
