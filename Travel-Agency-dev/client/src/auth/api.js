import axios from "axios";

const API_URL = "http://localhost:8000/api/";

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to attach the access token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refresh = localStorage.getItem("refreshToken");
        if (!refresh) {
          throw new Error("No refresh token available");
        }
        
        const response = await axios.post(API_URL + "token/refresh/", { refresh });
        const newAccessToken = response.data.access;
        
        // Store the new token
        localStorage.setItem("accessToken", newAccessToken);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - log out user
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const login = async (email, password) => {
  const response = await api.post("token/", { email, password });
  
  // Store tokens in localStorage
  localStorage.setItem("accessToken", response.data.access);
  localStorage.setItem("refreshToken", response.data.refresh);
  
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("register/", {
    email: userData.email,
    first_name: userData.first_name,
    last_name: userData.last_name,
    password: userData.password,
    password2: userData.password2,
  });
  return response.data;
};

export const refreshToken = async () => {
  const refresh = localStorage.getItem("refreshToken");
  if (!refresh) {
    throw new Error("No refresh token available");
  }
  
  const response = await axios.post(API_URL + "token/refresh/", { refresh });
  return response.data;
};

export const logout = async () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

export default api;