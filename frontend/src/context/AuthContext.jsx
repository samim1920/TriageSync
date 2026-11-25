
import React, {
  createContext,
  useContext,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  getToken,
} from "../services/authService";

const AuthContext = createContext(null);

// Custom hook to access authentication context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getCurrentUser);
  const [token, setToken] = useState(getToken);

  // Login user using backend API
  const login = async (credentials) => {
    const data = await loginUser(credentials);

    if (!data?.token || !data?.user) {
      throw new Error("Invalid login response from server");
    }

    const loggedInUser = data.user;

    if (!["ADMIN", "USER"].includes(loggedInUser.role)) {
      throw new Error("Invalid user role");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    localStorage.setItem("role", loggedInUser.role);

    setToken(data.token);
    setUser(loggedInUser);

    return loggedInUser;
  };

  // Register a new USER account
  const register = async (userData) => {
    const data = await registerUser(userData);

    if (!data?.token || !data?.user) {
      throw new Error("Invalid registration response from server");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("role", data.user.role);

    setToken(data.token);
    setUser(data.user);

    return data.user;
  };

  // Logout current user
  const logout = () => {
    logoutUser();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: Boolean(token && user),
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
