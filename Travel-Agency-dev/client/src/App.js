// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import Login from "./pages/LoginPage";
import Signup from "./pages/RegisterPage";
import FlightsPage from "./pages/FlightsPage";
import FlightBookingPage from "./pages/FlightBookingPage";
import UserBookingsPage from "./pages/UserBookingsPage";
import BookingDetailsPage from "./pages/BookingDetailsPage";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
//import HotelsPage from "./pages/HotelsPage";
//import HotelDetailsPage from "./pages/HotelDetailsPage";
//import HotelRoomsPage from "./pages/HotelRoomsPage";
//import HotelRoomBookingPage from "./pages/HotelRoomsPage";

import HotelSearchPage from "./HotelSearchPage";
import RoomSelectionPage from "./RoomSelectionPage";
import BookingForm from "./BookingForm";
import BookingRoomPage from "./BookingRoomPage";


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/flights" element={<FlightsPage />} />
          {/* <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/hotels/:hotel_id" element={<HotelDetailsPage />} />
          <Route path="/hotels/:hotel_id/rooms" element={<HotelRoomsPage />} /> */}

          <Route path="/hotels" element={<HotelSearchPage />} />
          <Route path="/hotels/room/:hotelCode" element={<RoomSelectionPage />} />
          <Route path="/hotels/booking-form/" element={<BookingForm />} />
          <Route path="/hotels/booking-room/" element={<BookingRoomPage />} />
          
          

          {/* Protected Routes */}
        <Route
          path="/book-flight"
          element={
            <ProtectedRoute>
              <FlightBookingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking-details/:flight_id"
          element={
            <ProtectedRoute>
              <BookingDetailsPage />
            </ProtectedRoute>
          }
        />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
