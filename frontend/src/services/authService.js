
import api from "./api";

// User Login
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", {
    email: credentials.email,
    password: credentials.password,
  });

  return response.data;
};

// User Registration
export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", {
    name: userData.name,
    email: userData.email,
    password: userData.password,
  });

  return response.data;
};

// User Logout
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("demoLogin");
};

// Get Current Logged-in User
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

// Get Stored JWT Token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Check Authentication
export const isAuthenticated = () => {
  return Boolean(getToken() && getCurrentUser());
};
