
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Eye,
  X,
  Building2,
  RefreshCw,
  User,
  Mail,
} from "lucide-react";
import api from "../../services/api";

const statusStyles = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

const formatDate = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "N/A";

  if (typeof value === "string" && value.includes("T")) {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  const parts = String(value).split(":");

  if (parts.length >= 2) {
    const hour = Number(parts[0]);
    const minute = parts[1];

    if (!Number.isNaN(hour)) {
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;

      return `${String(displayHour).padStart(2, "0")}:${minute} ${period}`;
    }
  }

  return String(value);
};

// Convert backend response into a consistent frontend structure.
const normalizeBooking = (booking) => {
  const resource = booking.resource || {};
  const user = booking.user || {};

  const id =
    booking.id ??
    booking.bookingId ??
    booking.bookingID;

  const resourceName =
    booking.resourceName ??
    resource.name ??
    booking.resourceTitle ??
    "Resource";

  const startTime =
    booking.startTime ??
    booking.startDateTime ??
    booking.fromTime;

  const endTime =
    booking.endTime ??
    booking.endDateTime ??
    booking.toTime;

  return {
    id,
    resource: resourceName,
    type:
      booking.resourceType ??
      resource.type ??
      booking.type ??
      "N/A",
    bookedBy:
      booking.userName ??
      user.name ??
      booking.bookedBy ??
      "Unknown User",
    email:
      booking.userEmail ??
      user.email ??
      booking.email ??
      "N/A",
    date: formatDate(
      booking.bookingDate ??
      booking.date ??
      booking.startDate
    ),
    time: `${formatTime(startTime)} - ${formatTime(endTime)}`,
    purpose: booking.purpose ?? booking.description ?? "N/A",
    status: String(booking.status || "PENDING").toUpperCase(),
    raw: booking,
  };
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [decisionNote, setDecisionNote] = useState("");

  // Load all bookings from backend.
  const fetchBookings = useCallback(async (initial = false) => {
    try {
      if (initial) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      const response = await api.get("/bookings");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content || response.data?.data || [];

      setBookings(data.map(normalizeBooking));
    } catch (err) {
      console.error("Fetch bookings error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load bookings. Please check your backend API and permissions."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings(true);
  }, [fetchBookings]);

  // Statistics.
  const total = bookings.length;

  const pending = bookings.filter(
    (b) => b.status === "PENDING"
  ).length;

  const approved = bookings.filter(
    (b) => b.status === "APPROVED"
  ).length;

  const rejected = bookings.filter(
    (b) => b.status === "REJECTED"
  ).length;

  const stats = [
    {
      title: "Total Bookings",
      value: total,
      icon: CalendarDays,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Pending Requests",
      value: pending,
      icon: Clock,
      color: "bg-amber-100 text-amber-700",
    },
    {
      title: "Approved",
      value: approved,
      icon: CheckCircle,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Rejected",
      value: rejected,
      icon: XCircle,
      color: "bg-red-100 text-red-700",
    },
  ];

  // Search and status filtering.
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const query = search.toLowerCase();

      const searchMatch =
        String(booking.id).toLowerCase().includes(query) ||
        booking.resource.toLowerCase().includes(query) ||
        booking.bookedBy.toLowerCase().includes(query) ||
        booking.email.toLowerCase().includes(query);

      const statusMatch =
        statusFilter === "ALL" ||
        booking.status === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [bookings, search, statusFilter]);

  // Approve booking.
  const handleApprove = async (booking) => {
    if (!booking?.id) return;

    try {
      setProcessing(true);
      setError("");
      setSuccess("");

      await api.patch(`/bookings/${booking.id}/approve`);

      setSuccess("Booking approved successfully.");
      setSelectedBooking(null);

      await fetchBookings(false);
    } catch (err) {
      console.error("Approve booking error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to approve booking."
      );
    } finally {
      setProcessing(false);
    }
  };

  // Reject booking.
  const handleReject = async () => {
    if (!selectedBooking?.id) return;

    if (!decisionNote.trim()) {
      setError("Please enter a reason for rejection.");
      return;
    }

    try {
      setProcessing(true);
      setError("");
      setSuccess("");

      await api.patch(
        `/bookings/${selectedBooking.id}/reject`,
        {
          note: decisionNote.trim(),
        }
      );

      setSuccess("Booking rejected successfully.");
      setShowRejectModal(false);
      setSelectedBooking(null);
      setDecisionNote("");

      await fetchBookings(false);
    } catch (err) {
      console.error("Reject booking error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to reject booking."
      );
    } finally {
      setProcessing(false);
    }
  };

  const openBookingDetails = async (booking) => {
    setSelectedBooking(booking);
    setError("");

    // Fetch the latest booking details.
    try {
      const response = await api.get(`/bookings/${booking.id}`);

      if (response.data) {
        setSelectedBooking(normalizeBooking(response.data));
      }
    } catch (err) {
      console.error("Booking details error:", err);
    }
  };

  const closeDetails = () => {
    if (processing) return;

    setSelectedBooking(null);
    setShowRejectModal(false);
    setDecisionNote("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[#F2F7FA] p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#173B57]">
            Booking Management
          </h1>

          <p className="text-gray-500 mt-2">
            Manage resource booking requests and approvals.
          </p>
        </div>

        <button
          onClick={() => fetchBookings(false)}
          disabled={refreshing}
          className="flex items-center justify-center gap-2 bg-white border border-gray-200 px-5 py-3 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw
            size={18}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
          {success}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {item.title}
                  </p>

                  <h2 className="text-3xl font-bold text-[#173B57] mt-2">
                    {loading ? "..." : item.value}
                  </h2>
                </div>

                <div className={`p-3 rounded-lg ${item.color}`}>
                  <Icon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search booking ID, resource or user..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#12A89D]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#12A89D]"
          >
            <option value="ALL">All Bookings</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Booking Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#173B57]">
            All Booking Requests
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredBookings.length} of {total} bookings
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[850px]">
            <thead className="bg-[#F2F7FA] text-gray-600 text-sm">
              <tr>
                <th className="px-5 py-4">Booking ID</th>
                <th className="px-5 py-4">Resource</th>
                <th className="px-5 py-4">Booked By</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Time</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-12 text-gray-500"
                  >
                    Loading bookings from server...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-12 text-gray-500"
                  >
                    No booking requests found.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-[#12A89D]">
                      #{booking.id}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-[#202B38]">
                        {booking.resource}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {booking.type}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-700">
                        {booking.bookedBy}
                      </p>
                      <p className="text-xs text-gray-400">
                        {booking.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {booking.date}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {booking.time}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusStyles[booking.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => openBookingDetails(booking)}
                        title="View Booking"
                        className="p-2 text-[#12A89D] hover:bg-teal-50 rounded-lg transition"
                      >
                        <Eye size={19} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && !showRejectModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={closeDetails}
        >
          <div
            className="bg-white w-full max-w-xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <p className="text-sm font-semibold text-[#12A89D]">
                  Booking #{selectedBooking.id}
                </p>

                <h2 className="text-xl font-bold text-[#173B57] mt-1">
                  Booking Details
                </h2>
              </div>

              <button
                onClick={closeDetails}
                disabled={processing}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={22} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-teal-50 rounded-lg">
                  <Building2 className="text-[#12A89D]" size={25} />
                </div>

                <div>
                  <p className="text-sm text-gray-500">Resource</p>
                  <p className="font-semibold text-[#173B57]">
                    {selectedBooking.resource}
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Booked By</p>
                  <p className="font-medium flex items-center gap-2">
                    <User size={15} />
                    {selectedBooking.bookedBy}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium text-sm flex items-center gap-2 break-all">
                    <Mail size={15} />
                    {selectedBooking.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Resource Type</p>
                  <p className="font-medium">
                    {selectedBooking.type}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Booking Date</p>
                  <p className="font-medium">
                    {selectedBooking.date}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Time Slot</p>
                  <p className="font-medium">
                    {selectedBooking.time}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Purpose</p>
                <p className="bg-[#F2F7FA] p-4 rounded-lg text-sm text-gray-700">
                  {selectedBooking.purpose}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#202B38] mb-2">
                  Booking Status
                </p>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    statusStyles[selectedBooking.status] ||
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {selectedBooking.status}
                </span>
              </div>

              {selectedBooking.status === "PENDING" && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleApprove(selectedBooking)}
                    disabled={processing}
                    className="bg-[#12A89D] hover:bg-[#0E8E85] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle size={18} />
                    {processing ? "Processing..." : "Approve"}
                  </button>

                  <button
                    onClick={() => {
                      setError("");
                      setDecisionNote("");
                      setShowRejectModal(true);
                    }}
                    disabled={processing}
                    className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                </div>
              )}

              <button
                onClick={closeDetails}
                disabled={processing}
                className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 py-3 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && selectedBooking && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4"
          onClick={() => {
            if (!processing) setShowRejectModal(false);
          }}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-[#173B57]">
              Reject Booking
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Please provide a reason for rejecting booking #{selectedBooking.id}.
            </p>

            <textarea
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              rows="4"
              placeholder="Enter rejection reason..."
              className="w-full mt-5 border border-gray-200 rounded-lg p-3 outline-none focus:border-[#12A89D] resize-none"
            />

            {error && (
              <p className="text-sm text-red-600 mt-2">{error}</p>
            )}

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowRejectModal(false)}
                disabled={processing}
                className="flex-1 border border-gray-200 py-3 rounded-lg font-semibold text-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={handleReject}
                disabled={processing || !decisionNote.trim()}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {processing ? "Rejecting..." : "Confirm Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;

