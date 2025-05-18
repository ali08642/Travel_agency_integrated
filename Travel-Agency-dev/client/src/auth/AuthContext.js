import { createContext, useContext, useState, useEffect } from "react";
import { login, register, refreshToken, logout as apiLogout } from "./api";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = localStorage.getItem("user");
      const storedAccessToken = localStorage.getItem("accessToken");

      if (storedUser && storedAccessToken) {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedAccessToken);
      } else {
        // Try to refresh token if only refresh token exists
        const storedRefreshToken = localStorage.getItem("refreshToken");
        if (storedRefreshToken) {
          try {
            const data = await refreshToken();
            localStorage.setItem("accessToken", data.access);
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
            setAccessToken(data.access);
          } catch (error) {
            await apiLogout();
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password);
      const userData = { email }; 

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setAccessToken(data.access);

      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.response?.data?.detail || "Invalid credentials",
      });
      return false;
    }
  };

  const handleRegister = async (userData) => {
    try {
      await register(userData);
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "You can now login with your credentials",
      });
      return true;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.response?.data || "Registration failed",
      });
      return false;
    }
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    setAccessToken(null);
  };

  const value = {
    user,
    accessToken,
    loading,
    handleLogin,
    handleRegister,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
