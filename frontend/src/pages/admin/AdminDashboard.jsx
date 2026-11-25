
import React, { useEffect, useState, useCallback } from "react";
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  ArrowUpRight,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getAllTickets } from "../../services/ticketService";

// Convert backend status into dashboard labels
const formatStatus = (status) => {
  switch (status) {
    case "OPEN":
      return "Pending";
    case "IN_PROGRESS":
      return "In Progress";
    case "RESOLVED":
      return "Resolved";
    case "CLOSED":
      return "Closed";
    default:
      return status || "Unknown";
  }
};

// Format date from backend
const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusStyle = (status) => {
  switch (formatStatus(status)) {
    case "Pending":
      return "bg-amber-100 text-amber-700";
    case "In Progress":
      return "bg-blue-100 text-blue-700";
    case "Resolved":
      return "bg-green-100 text-green-700";
    case "Closed":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "HIGH":
      return "text-red-600 bg-red-50";
    case "MEDIUM":
      return "text-amber-600 bg-amber-50";
    case "LOW":
      return "text-green-600 bg-green-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all complaints from backend
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllTickets();

      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);

      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Unable to load complaints. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Calculate statistics dynamically
  const totalComplaints = tickets.length;

  const pendingCount = tickets.filter(
    (ticket) => ticket.status === "OPEN"
  ).length;

  const inProgressCount = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS"
  ).length;

  const resolvedCount = tickets.filter(
    (ticket) => ticket.status === "RESOLVED"
  ).length;

  const stats = [
    {
      title: "Total Complaints",
      value: totalComplaints,
      description: "All registered complaints",
      icon: Ticket,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Pending",
      value: pendingCount,
      description: "Awaiting action",
      icon: Clock,
      color: "bg-amber-100 text-amber-700",
    },
    {
      title: "In Progress",
      value: inProgressCount,
      description: "Currently being handled",
      icon: AlertTriangle,
      color: "bg-purple-100 text-purple-700",
    },
    {
      title: "Resolved",
      value: resolvedCount,
      description: "Successfully completed",
      icon: CheckCircle,
      color: "bg-green-100 text-green-700",
    },
  ];

  // Calculate percentages for complaint overview
  const overview = [
    {
      label: "Resolved",
      count: resolvedCount,
      color: "bg-green-500",
    },
    {
      label: "In Progress",
      count: inProgressCount,
      color: "bg-blue-500",
    },
    {
      label: "Pending",
      count: pendingCount,
      color: "bg-amber-500",
    },
  ].map((item) => ({
    ...item,
    percentage:
      totalComplaints === 0
        ? 0
        : Math.round((item.count / totalComplaints) * 100),
  }));

  // Latest complaints first
  const recentTickets = [...tickets]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("demoLogin");
    localStorage.removeItem("token");

    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F2F7FA] p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#173B57]">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Welcome back! Here's what's happening with TriageSync.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            System Operational
          </div>

          <button
            onClick={fetchTickets}
            disabled={loading}
            className="flex items-center gap-2 bg-white text-[#173B57] hover:bg-gray-100 px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-semibold transition"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-center justify-between gap-3">
          <span>{error}</span>

          <button
            onClick={fetchTickets}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-5">

                <div className={`p-3 rounded-lg ${item.color}`}>
                  <Icon size={23} />
                </div>

                <ArrowUpRight
                  className="text-gray-400"
                  size={20}
                />

              </div>

              <h3 className="text-gray-500 text-sm font-medium">
                {item.title}
              </h3>

              <p className="text-3xl font-bold text-[#173B57] mt-2">
                {loading ? "..." : item.value}
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {item.description}
              </p>
            </div>
          );
        })}

      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Complaint Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">

          <div className="flex items-center justify-between mb-6">

            <div>
              <h2 className="text-lg font-bold text-[#173B57]">
                Complaint Overview
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Current complaint status summary
              </p>
            </div>

            <Ticket className="text-[#12A89D]" size={25} />

          </div>

          <div className="space-y-5">

            {overview.map((item) => (
              <div key={item.label}>

                <div className="flex justify-between text-sm mb-2">

                  <span className="font-medium text-gray-700">
                    {item.label}
                  </span>

                  <span className="text-gray-500">
                    {loading ? "..." : `${item.count} (${item.percentage}%)`}
                  </span>

                </div>

                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">

                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{
                      width: `${loading ? 0 : item.percentage}%`,
                    }}
                  />

                </div>

              </div>
            ))}

          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#173B57] rounded-xl p-6 text-white">

          <h2 className="text-lg font-bold mb-2">
            Quick Actions
          </h2>

          <p className="text-sm text-gray-300 mb-6">
            Manage your complaint system.
          </p>

          <div className="space-y-3">

            <Link
              to="/admin/tickets"
              className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-3 rounded-lg transition"
            >
              <span className="flex items-center gap-3 text-sm">
                <Ticket size={19} />
                Manage Complaints
              </span>

              <ArrowUpRight size={18} />
            </Link>

            <Link
              to="/admin/resources"
              className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-3 rounded-lg transition"
            >
              <span className="flex items-center gap-3 text-sm">
                <Users size={19} />
                Manage Resources
              </span>

              <ArrowUpRight size={18} />
            </Link>

            <Link
              to="/admin/bookings"
              className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-3 rounded-lg transition"
            >
              <span className="flex items-center gap-3 text-sm">
                <Clock size={19} />
                Manage Bookings
              </span>

              <ArrowUpRight size={18} />
            </Link>

            <Link
              to="/admin/analytics"
              className="flex items-center justify-between bg-white/10 hover:bg-white/20 p-3 rounded-lg transition"
            >
              <span className="flex items-center gap-3 text-sm">
                <ArrowUpRight size={19} />
                View Analytics
              </span>

              <ArrowUpRight size={18} />
            </Link>

          </div>
        </div>

      </div>

      {/* Recent Complaints */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

          <div>
            <h2 className="text-lg font-bold text-[#173B57]">
              Recent Complaints
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Latest complaints submitted by users.
            </p>
          </div>

          <Link
            to="/admin/tickets"
            className="text-[#12A89D] font-semibold text-sm hover:underline flex items-center gap-1"
          >
            View All
            <ArrowUpRight size={17} />
          </Link>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-[#F2F7FA] text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4 font-semibold">Ticket ID</th>
                <th className="px-6 py-4 font-semibold">Subject</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Priority</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-10 text-gray-500"
                  >
                    Loading complaints...
                  </td>
                </tr>
              ) : recentTickets.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-10 text-gray-500"
                  >
                    No complaints found.
                  </td>
                </tr>
              ) : (
                recentTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-gray-50 transition"
                  >

                    <td className="px-6 py-4 text-sm font-semibold text-[#12A89D] whitespace-nowrap">
                      {ticket.externalId}
                    </td>

                    <td className="px-6 py-4 text-sm text-[#202B38] font-medium min-w-56">
                      {ticket.subject}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {ticket.category || "N/A"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityStyle(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority || "N/A"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                          ticket.status
                        )}`}
                      >
                        {formatStatus(ticket.status)}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(ticket.createdAt)}
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>

        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-400">
        © 2026 TriageSync Admin Panel. All rights reserved.
      </div>

    </div>
  );
};

export default AdminDashboard;
