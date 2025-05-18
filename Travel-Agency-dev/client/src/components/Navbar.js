import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="px-4 sm:px-6 py-3 w-full">
        <div className="flex justify-between items-center w-full">
          {/* Logo - Left aligned */}
          <Link
            to="/"
            className="text-3xl font-bold italic font-[Lobster] whitespace-nowrap"
          >
            Travel Agency
          </Link>

          {/* Desktop Navigation - Right aligned with all elements */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/flights"
              className="text-gray-700 hover:text-blue-500 transition whitespace-nowrap"
            >
              Flights
            </Link>
            <Link
              to="/hotels"
              className="text-gray-700 hover:text-blue-500 transition whitespace-nowrap"
            >
              Hotels
            </Link>
            <Link
              to="/transport"
              className="text-gray-700 hover:text-blue-500 transition whitespace-nowrap"
            >
              Transport
            </Link>
            <Link
              to="/services"
              className="text-gray-700 hover:text-blue-500 transition whitespace-nowrap"
            >
              Services
            </Link>

            {/* Add My Bookings link */}
            {user && (
              <Link
                to="/my-bookings"
                className="text-gray-700 hover:text-blue-500 transition whitespace-nowrap"
              >
                My Bookings
              </Link>
            )}

            {user ? (
              <button
                onClick={logout}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition whitespace-nowrap"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition whitespace-nowrap"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition whitespace-nowrap"
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isOpen ? "max-h-screen" : "max-h-0"
          }`}
        >
          <div className="flex flex-col space-y-3 py-3">
            <Link
              to="/flights"
              className="px-3 py-2 hover:bg-blue-50 rounded transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Flights
            </Link>
            <Link
              to="/hotels"
              className="px-3 py-2 hover:bg-blue-50 rounded transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Hotels
            </Link>
            <Link
              to="/transport"
              className="px-3 py-2 hover:bg-blue-50 rounded transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Transport
            </Link>
            <Link
              to="/services"
              className="px-3 py-2 hover:bg-blue-50 rounded transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>

            {/* Add My Bookings to mobile menu */}
            {user && (
              <Link
                to="/my-bookings"
                className="px-3 py-2 hover:bg-blue-50 rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                My Bookings
              </Link>
            )}

            <div className="border-t pt-3">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="block w-full px-3 py-2 text-center border border-gray-300 rounded hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block w-full px-3 py-2 text-center border border-gray-300 rounded hover:bg-gray-100 transition mb-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full px-3 py-2 text-center bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
