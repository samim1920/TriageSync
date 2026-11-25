
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageTickets from "./pages/admin/ManageTickets";
import Bookings from "./pages/admin/Bookings";
import Resources from "./pages/admin/Resources";
import Analytics from "./pages/admin/Analytics";

// User Pages
import UserDashboard from "./pages/user/UserDashboard";
import MyTickets from "./pages/user/MyTickets";
import SubmitComplaint from "./pages/user/SubmitComplaint";
import TicketDetails from "./pages/user/TicketDetails";

// Layout Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Public Layout
const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

// App Routes
const AppRoute = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />
        <Route
          path="/register"
          element={
            <PublicLayout>
              <Register />
            </PublicLayout>
          }
        />

        {/* Public Information Pages */}
        <Route
          path="/progress"
          element={<Navigate to="/login" replace />}
        />
        <Route
          path="/how-it-works"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/sos"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/faq"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/contact"
          element={<Navigate to="/" replace />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={<Navigate to="/admin/admindashboard" replace />}
        />
        <Route
          path="/admin/admindashboard"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin/tickets"
          element={<ManageTickets />}
        />
        <Route
          path="/admin/bookings"
          element={<Bookings />}
        />
        <Route
          path="/admin/resources"
          element={<Resources />}
        />
        <Route
          path="/admin/analytics"
          element={<Analytics />}
        />

        {/* User Routes */}
        <Route
          path="/user"
          element={<Navigate to="/user/dashboard" replace />}
        />
        <Route
          path="/user/dashboard"
          element={<UserDashboard />}
        />
        <Route
          path="/user/tickets"
          element={<MyTickets />}
        />
        <Route
          path="/user/tickets/:id"
          element={<TicketDetails />}
        />
        <Route
          path="/user/submit-complaint"
          element={<SubmitComplaint />}
        />

        {/* 404 Route */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoute;
