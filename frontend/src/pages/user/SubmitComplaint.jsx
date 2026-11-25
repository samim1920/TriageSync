
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  Ticket,
  PlusCircle,
  UserRound,
  LogOut,
  ArrowLeft,
  Send,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

import { createTicket } from "../../services/ticketService";
import { useAuth } from "../../context/AuthContext";

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get the logged-in user's information
  const getStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  };

  const user = getStoredUser();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // Submit complaint to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess(false);

    if (!formData.subject.trim() || !formData.description.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.subject.trim().length > 150) {
      setError("Subject cannot exceed 150 characters.");
      return;
    }

    if (formData.description.trim().length > 3000) {
      setError("Description cannot exceed 3000 characters.");
      return;
    }

    try {
      setLoading(true);

      const ticketData = {
        externalId: `TKT-${Date.now()}`,
        subject: formData.subject.trim(),
        body: formData.description.trim(),
      };

      // Call Spring Boot API
      const response = await createTicket(ticketData);

      console.log("Complaint submitted:", response);

      setSuccess(true);

      // Redirect after successful submission
      setTimeout(() => {
        navigate("/user/tickets", { replace: true });
      }, 1200);
    } catch (err) {
      console.error("Complaint submission error:", err);

      const responseData = err.response?.data;

      setError(
        responseData?.message ||
          responseData?.detail ||
          responseData?.error ||
          err.message ||
          "Unable to submit complaint. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset form fields
  const handleReset = () => {
    setFormData({
      subject: "",
      description: "",
    });

    setError("");
    setSuccess(false);
  };

  // Logout user
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F2F7FA] flex">

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#173B57] text-white flex-col fixed h-screen">

        <Link
          to="/"
          className="flex items-center gap-3 px-6 py-6 border-b border-white/10"
        >
          <div className="bg-[#12A89D] p-2 rounded-lg">
            <ShieldCheck size={25} />
          </div>

          <span className="text-2xl font-bold">
            Triage<span className="text-[#12A89D]">Sync</span>
          </span>
        </Link>

        <div className="px-5 py-7">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">
            User Menu
          </p>

          <nav className="space-y-2">

            <Link
              to="/user/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 transition"
            >
              <LayoutDashboard size={19} />
              Dashboard
            </Link>

            <Link
              to="/user/tickets"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 transition"
            >
              <Ticket size={19} />
              My Tickets
            </Link>

            <Link
              to="/user/submit-complaint"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#12A89D] text-white"
            >
              <PlusCircle size={19} />
              Submit Complaint
            </Link>

          </nav>
        </div>

        <div className="mt-auto p-5 border-t border-white/10">

          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-[#12A89D] flex items-center justify-center">
              <UserRound size={21} />
            </div>

            <div className="min-w-0">
              <p className="font-semibold truncate">
                {user.name || "User"}
              </p>

              <p className="text-xs text-gray-400">
                Citizen Account
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-gray-300 hover:text-red-400 transition w-full px-3 py-2"
          >
            <LogOut size={19} />
            Logout
          </button>

        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 min-w-0">

        {/* Topbar */}
        <header className="bg-white px-5 sm:px-8 py-5 shadow-sm">
          <p className="text-sm text-gray-500">
            User Portal / Submit Complaint
          </p>

          <h1 className="text-xl sm:text-2xl font-bold text-[#173B57]">
            Submit New Complaint
          </h1>
        </header>

        <div className="p-5 sm:p-8 max-w-5xl mx-auto">

          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-xl font-bold text-[#173B57]">
              Complaint Information
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Please provide accurate details about your issue.
              Our team will review your complaint.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-green-700">
              <CheckCircle size={22} />

              <div>
                <p className="font-semibold">
                  Complaint submitted successfully!
                </p>

                <p className="text-sm">
                  Redirecting to My Tickets...
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600">
              <AlertCircle size={21} />

              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Complaint Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >

            <div className="p-6 sm:p-8 space-y-6">

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-[#202B38] mb-2">
                  Complaint Subject{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter a short title for your complaint"
                  maxLength={150}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#12A89D] focus:ring-2 focus:ring-[#12A89D]/10"
                  required
                  disabled={loading || success}
                />

                <p className="text-xs text-gray-400 mt-1">
                  {formData.subject.length}/150 characters
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-[#202B38] mb-2">
                  Complaint Description{" "}
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your issue in detail..."
                  rows={6}
                  maxLength={3000}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#12A89D] focus:ring-2 focus:ring-[#12A89D]/10 resize-y"
                  required
                  disabled={loading || success}
                />

                <p className="text-xs text-gray-400 mt-1 text-right">
                  {formData.description.length}/3000 characters
                </p>
              </div>

              {/* User Information */}
              <div className="bg-[#F2F7FA] rounded-lg p-4">
                <h3 className="font-semibold text-[#173B57] mb-2">
                  Submitted By
                </h3>

                <p className="text-sm text-gray-600">
                  Name: {user.name || "User"}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  Email: {user.email || "Not available"}
                </p>
              </div>

              {/* Classification Information */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Your complaint will be automatically classified
                  and assigned a priority by our ticket classification
                  system.
                </p>
              </div>

            </div>

            {/* Form Actions */}
            <div className="px-6 sm:px-8 py-5 border-t bg-gray-50 flex flex-col-reverse sm:flex-row justify-between gap-3">

              <button
                type="button"
                onClick={handleReset}
                disabled={loading || success}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 font-semibold hover:bg-gray-100 transition disabled:opacity-60"
              >
                Reset Form
              </button>

              <button
                type="submit"
                disabled={loading || success}
                className="px-6 py-3 bg-[#12A89D] hover:bg-[#0E8E85] text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
              >
                <Send size={18} />

                {loading ? "Submitting..." : "Submit Complaint"}
              </button>

            </div>

          </form>

          {/* Back to Dashboard */}
          <Link
            to="/user/dashboard"
            className="inline-flex items-center gap-2 text-[#173B57] font-semibold mt-6 hover:text-[#12A89D]"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          <footer className="text-center text-sm text-gray-500 mt-10 py-5 border-t">
            © 2026 TriageSync. All rights reserved.
          </footer>

        </div>
      </main>
    </div>
  );
};

export default SubmitComplaint;
