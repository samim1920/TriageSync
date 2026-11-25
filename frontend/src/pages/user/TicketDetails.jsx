
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  Ticket,
  PlusCircle,
  UserRound,
  LogOut,
  ArrowLeft,
  Calendar,
  Tag,
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  Hash,
  RefreshCw,
} from "lucide-react";

import { getTicketById } from "../../services/ticketService";
import { useAuth } from "../../context/AuthContext";

const TicketDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, logout } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch ticket details from the backend.
  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getTicketById(id);
      setTicket(response);
    } catch (err) {
      console.error("Failed to fetch ticket:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          "Unable to load ticket details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTicket();
    }
  }, [id]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const getStatus = () => {
    return String(ticket?.status ?? "OPEN").toUpperCase();
  };

  const getPriority = () => {
    return String(ticket?.priority ?? "NOT_ASSIGNED").toUpperCase();
  };

  const getStatusStyle = (status) => {
    switch (String(status).toUpperCase()) {
      case "RESOLVED":
      case "CLOSED":
        return "bg-green-100 text-green-700";

      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";

      case "PENDING":
      case "OPEN":
        return "bg-amber-100 text-amber-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (String(priority).toUpperCase()) {
      case "CRITICAL":
      case "URGENT":
      case "HIGH":
        return "bg-red-100 text-red-700";

      case "MEDIUM":
        return "bg-amber-100 text-amber-700";

      case "LOW":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (String(status).toUpperCase()) {
      case "RESOLVED":
      case "CLOSED":
        return <CheckCircle size={22} />;

      case "IN_PROGRESS":
        return <Clock size={22} />;

      default:
        return <AlertCircle size={22} />;
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Not available";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const ticketId =
    ticket?.externalId ?? ticket?.id ?? ticket?.ticketId ?? id;

  const subject = ticket?.subject ?? "Untitled complaint";

  const category = ticket?.category ?? "Not classified";

  const priority = getPriority();

  const status = getStatus();

  const description =
    ticket?.body ??
    ticket?.description ??
    ticket?.message ??
    "No description available.";

  const submittedDate =
    ticket?.createdAt ?? ticket?.createdDate ?? ticket?.date;

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
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#12A89D] text-white"
            >
              <Ticket size={19} />
              My Tickets
            </Link>

            <Link
              to="/user/submit-complaint"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 transition"
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
                {user?.name || "User"}
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
            User Portal / My Tickets / Ticket Details
          </p>

          <h1 className="text-xl sm:text-2xl font-bold text-[#173B57]">
            Complaint Details
          </h1>

        </header>

        <div className="p-5 sm:p-8 max-w-5xl mx-auto">

          {/* Back Button */}
          <Link
            to="/user/tickets"
            className="inline-flex items-center gap-2 text-[#173B57] font-semibold mb-6 hover:text-[#12A89D]"
          >
            <ArrowLeft size={18} />
            Back to My Tickets
          </Link>

          {/* Loading */}
          {loading && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <RefreshCw
                size={35}
                className="mx-auto text-[#12A89D] animate-spin mb-4"
              />

              <p className="font-semibold text-gray-600">
                Loading complaint details...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center">

              <AlertCircle
                size={45}
                className="mx-auto text-red-400 mb-4"
              />

              <h2 className="text-xl font-bold text-[#173B57]">
                Unable to Load Ticket
              </h2>

              <p className="text-gray-500 mt-2">
                {error}
              </p>

              <button
                onClick={fetchTicket}
                className="mt-6 bg-[#12A89D] hover:bg-[#0E8E85] text-white px-6 py-3 rounded-lg font-semibold"
              >
                Try Again
              </button>

            </div>
          )}

          {/* Ticket Not Found */}
          {!loading && !error && !ticket && (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center">

              <FileText
                size={50}
                className="mx-auto text-gray-300 mb-4"
              />

              <h2 className="text-xl font-bold text-[#173B57]">
                Ticket Not Found
              </h2>

              <p className="text-gray-500 mt-2">
                This ticket could not be found.
              </p>

              <Link
                to="/user/tickets"
                className="inline-block mt-6 bg-[#12A89D] text-white px-6 py-3 rounded-lg font-semibold"
              >
                View My Tickets
              </Link>

            </div>
          )}

          {/* Ticket Details */}
          {!loading && !error && ticket && (
            <>

              {/* Ticket Header */}
              <div className="bg-[#173B57] rounded-xl p-6 sm:p-8 text-white mb-6">

                <div className="flex flex-col sm:flex-row justify-between gap-5">

                  <div>
                    <p className="text-[#12A89D] font-semibold text-sm mb-2">
                      COMPLAINT DETAILS
                    </p>

                    <h2 className="text-2xl font-bold mb-3">
                      {subject}
                    </h2>

                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <Hash size={16} />
                      {ticketId}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 items-start">

                    <span
                      className={`px-4 py-2 rounded-full text-xs font-bold ${getStatusStyle(status)}`}
                    >
                      {status.replaceAll("_", " ")}
                    </span>

                    <span
                      className={`px-4 py-2 rounded-full text-xs font-bold ${getPriorityStyle(priority)}`}
                    >
                      {priority.replaceAll("_", " ")} PRIORITY
                    </span>

                  </div>

                </div>
              </div>

              {/* Status Overview */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">

                <h3 className="font-bold text-lg text-[#173B57] mb-5">
                  Current Status
                </h3>

                <div className="flex items-center gap-4">

                  <div className="bg-[#F2F7FA] p-4 rounded-xl text-[#12A89D]">
                    {getStatusIcon(status)}
                  </div>

                  <div>
                    <p className="font-bold text-[#173B57]">
                      {status.replaceAll("_", " ")}
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      {status === "RESOLVED" || status === "CLOSED"
                        ? "Your complaint has been resolved."
                        : status === "IN_PROGRESS"
                        ? "Your complaint is currently being reviewed."
                        : status === "REJECTED"
                        ? "Your complaint has been rejected."
                        : "Your complaint is waiting for review."}
                    </p>
                  </div>

                </div>
              </div>

              {/* Complaint Information */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-6">

                <h3 className="text-lg font-bold text-[#173B57] mb-6">
                  Complaint Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Tag size={18} />
                      <span className="text-sm">Category</span>
                    </div>

                    <p className="font-semibold text-[#173B57]">
                      {category}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <AlertCircle size={18} />
                      <span className="text-sm">Priority</span>
                    </div>

                    <p className="font-semibold text-[#173B57]">
                      {priority.replaceAll("_", " ")}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Calendar size={18} />
                      <span className="text-sm">Submission Date</span>
                    </div>

                    <p className="font-semibold text-[#173B57]">
                      {formatDate(submittedDate)}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <UserRound size={18} />
                      <span className="text-sm">Submitted By</span>
                    </div>

                    <p className="font-semibold text-[#173B57]">
                      {ticket.createdBy?.name ??
                        ticket.user?.name ??
                        ticket.createdByName ??
                        user?.name ??
                        "User"}
                    </p>
                  </div>

                </div>

                <div className="border-t my-7" />

                <div>
                  <div className="flex items-center gap-2 text-gray-400 mb-3">
                    <FileText size={18} />
                    <span className="text-sm">Description</span>
                  </div>

                  <p className="text-gray-700 leading-7 whitespace-pre-wrap">
                    {description}
                  </p>
                </div>

              </div>

              {/* User Information */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">

                <h3 className="font-bold text-[#173B57] mb-4">
                  Submitted By
                </h3>

                <p className="text-sm text-gray-600">
                  Name: {user?.name || "User"}
                </p>

                <p className="text-sm text-gray-600 mt-2">
                  Email: {user?.email || "Not available"}
                </p>

              </div>

            </>
          )}

          {/* Footer */}
          <footer className="text-center text-sm text-gray-500 mt-10 py-5 border-t">
            © 2026 TriageSync. All rights reserved.
          </footer>

        </div>
      </main>
    </div>
  );
};

export default TicketDetails;
