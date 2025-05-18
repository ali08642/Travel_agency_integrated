import { Link, useNavigate } from "react-router-dom";
import loginImage from "../assets/login.jpg";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    
    const success = await handleLogin(email, password);
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen items-center justify-center">
      {/* Left Side - Login Form */}
      <div className="md:w-1/2 w-full flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-4xl font-bold text-gray-700 text-center">
            Welcome <span className="text-blue-600">Back!</span>
          </h2>
          <p className="text-gray-500 text-center mt-2">
            Please login to your account.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-gray-700 font-medium">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your email"
                aria-label="Email Address"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your password"
                aria-label="Password"
                required
              />
            </div>

            <div className="mt-2 text-right">
              <Link to="#" className="text-blue-500 text-sm hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition"
              type="submit"
            >
              Login
            </button>

            <div className="mt-4 text-center">
              <Link
                to="/signup"
                className="border border-blue-600 text-blue-600 py-2 px-6 rounded-md font-semibold hover:bg-blue-600 hover:text-white transition"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:flex md:w-1/2 justify-center items-center">
        <img
          src={loginImage}
          alt="Person traveling with luggage"
          className="w-3/4 max-w-lg"
        />
      </div>
    </div>
  );
}
