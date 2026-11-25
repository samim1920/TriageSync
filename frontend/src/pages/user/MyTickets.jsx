
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Search,
  Filter,
  ArrowLeft,
  Eye,
  LogOut,
  UserRound,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { getAllTickets } from "../../services/ticketService";
import { useAuth } from "../../context/AuthContext";

const MyTickets = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get the owner ID or email from a ticket response.
  const getTicketOwner = (ticket) => {
    return (
      ticket.userId ??
      ticket.createdById ??
      ticket.ownerId ??
      ticket.user?.id ??
      ticket.createdBy?.id ??
      ticket.owner?.id ??
      ticket.user?.email ??
      ticket.createdBy?.email ??
      ticket.owner?.email ??
      ticket.createdByEmail ??
      ticket.userEmail ??
      null
    );
  };

  // Fetch tickets from the backend.
  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllTickets();

      const ticketList = Array.isArray(response)
        ? response
        : response?.content ??
          response?.data ??
          response?.tickets ??
          [];

      if (!Array.isArray(ticketList)) {
        throw new Error("Invalid ticket response received from server.");
      }

      // Only display tickets belonging to the logged-in user.
      const currentUserId = user?.id;
      const currentUserEmail = user?.email?.toLowerCase();

      const ownedTickets = ticketList.filter((ticket) => {
        const owner = getTicketOwner(ticket);

        if (owner === null || owner === undefined) {
          return false;
        }

        return (
          String(owner) === String(currentUserId) ||
          String(owner).toLowerCase() === currentUserEmail
        );
      });

      // Do not silently display tickets when ownership cannot be verified.
      if (
        ticketList.length > 0 &&
        ownedTickets.length === 0 &&
        !ticketList.some((ticket) => getTicketOwner(ticket) !== null)
      ) {
        throw new Error(
          "The backend response does not contain ticket owner information. Please update the TicketResponse DTO or make GET /api/tickets return only the logged-in user's tickets."
        );
      }

      setTickets(ownedTickets);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.detail ||
          err.message ||
          "Unable to load your complaints. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const getTicketId = (ticket) => {
    return ticket.id ?? ticket.ticketId ?? ticket.externalId;
  };

  const getTicketSubject = (ticket) => {
    return ticket.subject ?? "Untitled complaint";
  };

  const getTicketCategory = (ticket) => {
    return ticket.category ?? "Not classified";
  };

  const getTicketPriority = (ticket) => {
    return ticket.priority ?? "NOT_ASSIGNED";
  };

  const getTicketStatus = (ticket) => {
    return ticket.status ?? "OPEN";
  };

  const getTicketDate = (ticket) => {
    const date = ticket.createdAt ?? ticket.createdDate ?? ticket.date;

    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return String(date);
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
        return "text-red-600";

      case "MEDIUM":
        return "text-amber-600";

      case "LOW":
        return "text-green-600";

      default:
        return "text-gray-600";
    }
  };

  // Apply search and filters.
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const ticketId = String(getTicketId(ticket) ?? "");
      const subject = getTicketSubject(ticket);
      const category = getTicketCategory(ticket);
      const status = String(getTicketStatus(ticket)).toUpperCase();
      const priority = String(getTicketPriority(ticket)).toUpperCase();

      const searchText = search.toLowerCase();

      const matchesSearch =
        ticketId.toLowerCase().includes(searchText) ||
        subject.toLowerCase().includes(searchText) ||
        category.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "ALL" || status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" || priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, search, statusFilter, priorityFilter]);

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
              <p className="text-xs text-gray-400">Citizen Account</p>
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
            User Portal / My Tickets
          </p>

          <h1 className="text-xl sm:text-2xl font-bold text-[#173B57]">
            My Complaints
          </h1>
        </header>

        <div className="p-5 sm:p-8">
          {/* Heading */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-7">
            <div>
              <h2 className="text-xl font-bold text-[#173B57]">
                All Complaints
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                View and track your submitted complaints.
              </p>
            </div>

            <Link
              to="/user/submit-complaint"
              className="bg-[#12A89D] hover:bg-[#0E8E85] text-white px-5 py-3 rounded-lg flex items-center justify-center gap-2 font-semibold transition"
            >
              <PlusCircle size={19} />
              New Complaint
            </Link>
          </div>

          {/* Filter Section */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={19} className="text-[#12A89D]" />
              <h3 className="font-semibold text-[#173B57]">
                Search & Filters
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search ticket or subject..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#12A89D]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#12A89D] bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="OPEN">Open</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#12A89D] bg-white"
              >
                <option value="ALL">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          {/* Ticket Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-[#173B57]">
                  Complaint List
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Showing {filteredTickets.length} complaints
                </p>
              </div>

              <button
                onClick={fetchTickets}
                disabled={loading}
                className="flex items-center gap-2 text-sm text-[#12A89D] hover:text-[#0E8E85] font-semibold disabled:opacity-50"
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-gray-50 text-gray-500 text-sm">
                  <tr>
                    <th className="px-5 py-4">Ticket ID</th>
                    <th className="px-5 py-4">Subject</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Priority</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-gray-500">
                        <RefreshCw size={28} className="mx-auto mb-3 animate-spin text-[#12A89D]" />
                        Loading your complaints...
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 px-5">
                        <AlertCircle size={35} className="mx-auto text-red-400 mb-3" />
                        <p className="font-semibold text-red-600">
                          Unable to load complaints
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {error}
                        </p>
                        <button
                          onClick={fetchTickets}
                          className="mt-4 bg-[#12A89D] text-white px-5 py-2 rounded-lg"
                        >
                          Try Again
                        </button>
                      </td>
                    </tr>
                  ) : filteredTickets.length > 0 ? (
                    filteredTickets.map((ticket) => {
                      const id = getTicketId(ticket);
                      const status = getTicketStatus(ticket);
                      const priority = getTicketPriority(ticket);

                      return (
                        <tr
                          key={id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-5 py-4 text-sm font-semibold text-[#173B57]">
                            {ticket.externalId ?? id}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-700">
                            {getTicketSubject(ticket)}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {getTicketCategory(ticket)}
                          </td>

                          <td
                            className={`px-5 py-4 text-sm font-semibold ${getPriorityStyle(priority)}`}
                          >
                            {String(priority).replaceAll("_", " ")}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(status)}`}
                            >
                              {String(status).replaceAll("_", " ")}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-500">
                            {getTicketDate(ticket)}
                          </td>

                          <td className="px-5 py-4">
                            <Link
                              to={`/user/tickets/${id}`}
                              className="inline-flex items-center gap-2 text-[#12A89D] font-semibold text-sm hover:underline"
                            >
                              <Eye size={17} />
                              View
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-12">
                        <Ticket
                          size={40}
                          className="mx-auto text-gray-300 mb-3"
                        />

                        <p className="font-semibold text-gray-600">
                          No complaints found
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                          Try changing your search or filters, or submit a new complaint.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Back Button */}
          <Link
            to="/user/dashboard"
            className="inline-flex items-center gap-2 text-[#173B57] font-semibold mt-6 hover:text-[#12A89D]"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>

          {/* Footer */}
          <footer className="text-center text-sm text-gray-500 mt-10 py-5 border-t">
            © 2026 TriageSync. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
};

export default MyTickets;
