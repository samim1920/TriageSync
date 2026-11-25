
import axios from "axios";

// Backend API URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle API responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message:
        error.response?.data?.message || error.message,
      data: error.response?.data,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
