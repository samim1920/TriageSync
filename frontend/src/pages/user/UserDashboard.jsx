
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  CheckCircle,
  Clock,
  AlertCircle,
  LogOut,
  UserRound,
  ShieldCheck,
  ArrowRight,
  FileText,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getAllTickets } from "../../services/ticketService";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ownerDataMissing, setOwnerDataMissing] = useState(false);

  const userName = user?.name || "User";
  const userEmail = user?.email || "";

  // Extract the ticket owner's information from the API response.
  const getTicketOwner = (ticket) => {
    const owner =
      ticket?.user ||
      ticket?.createdBy ||
      ticket?.owner ||
      ticket?.submittedBy ||
      ticket?.createdByUser;

    return {
      id:
        ticket?.userId ??
        ticket?.createdById ??
        ticket?.ownerId ??
        owner?.id ??
        owner?.userId ??
        null,

      email:
        ticket?.userEmail ??
        ticket?.createdByEmail ??
        ticket?.ownerEmail ??
        owner?.email ??
        null,
    };
  };

  // Only show tickets belonging to the currently logged-in user.
  const belongsToCurrentUser = (ticket) => {
    const owner = getTicketOwner(ticket);

    const currentUserId = user?.id ? String(user.id) : null;
    const currentUserEmail = user?.email?.toLowerCase();

    const ownerId = owner.id ? String(owner.id) : null;
    const ownerEmail = owner.email?.toLowerCase();

    if (currentUserId && ownerId && currentUserId === ownerId) {
      return true;
    }

    if (currentUserEmail && ownerEmail && currentUserEmail === ownerEmail) {
      return true;
    }

    return false;
  };

  const fetchDashboardTickets = async () => {
    try {
      setLoading(true);
      setError("");
      setOwnerDataMissing(false);

      const response = await getAllTickets();

      const allTickets = Array.isArray(response)
        ? response
        : response?.content ||
          response?.data ||
          response?.tickets ||
          [];

      if (!Array.isArray(allTickets)) {
        throw new Error("Invalid ticket data received from server.");
      }

      // Check whether the API response contains owner information.
      const hasOwnerInformation = allTickets.every((ticket) => {
        const owner = getTicketOwner(ticket);
        return owner.id !== null || Boolean(owner.email);
      });

      if (allTickets.length > 0 && !hasOwnerInformation) {
        setTickets([]);
        setOwnerDataMissing(true);
        return;
      }

      const myTickets = allTickets.filter(belongsToCurrentUser);

      myTickets.sort((a, b) => {
        const dateA = new Date(
          a.createdAt || a.createdDate || a.date || 0
        ).getTime();

        const dateB = new Date(
          b.createdAt || b.createdDate || b.date || 0
        ).getTime();

        return dateB - dateA;
      });

      setTickets(myTickets);
    } catch (err) {
      console.error("Dashboard ticket loading error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load dashboard data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardTickets();
  }, [user?.id, user?.email]);

  // Calculate statistics from actual backend tickets.
  const stats = useMemo(() => {
    const total = tickets.length;

    const pending = tickets.filter((ticket) =>
      ["OPEN", "PENDING"].includes(
        String(ticket.status || "").toUpperCase()
      )
    ).length;

    const inProgress = tickets.filter(
      (ticket) =>
        String(ticket.status || "").toUpperCase() === "IN_PROGRESS"
    ).length;

    const resolved = tickets.filter((ticket) =>
      ["RESOLVED", "CLOSED"].includes(
        String(ticket.status || "").toUpperCase()
      )
    ).length;

    return [
      {
        title: "Total Complaints",
        value: total,
        icon: Ticket,
        color: "bg-blue-100 text-blue-600",
      },
      {
        title: "Pending",
        value: pending,
        icon: Clock,
        color: "bg-amber-100 text-amber-600",
      },
      {
        title: "In Progress",
        value: inProgress,
        icon: AlertCircle,
        color: "bg-purple-100 text-purple-600",
      },
      {
        title: "Resolved",
        value: resolved,
        icon: CheckCircle,
        color: "bg-green-100 text-green-600",
      },
    ];
  }, [tickets]);

  const recentTickets = tickets.slice(0, 5);

  const getTicketId = (ticket) =>
    ticket.id ?? ticket.ticketId ?? ticket._id;

  const getDisplayTicketId = (ticket) =>
    ticket.externalId ||
    ticket.ticketNumber ||
    `#${getTicketId(ticket)}`;

  const getStatusStyle = (status) => {
    switch (String(status || "").toUpperCase()) {
      case "RESOLVED":
      case "CLOSED":
        return "bg-green-100 text-green-700";

      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";

      case "OPEN":
      case "PENDING":
        return "bg-amber-100 text-amber-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (String(priority || "").toUpperCase()) {
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

  const formatDate = (dateValue) => {
    if (!dateValue) return "N/A";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

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
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#12A89D] text-white"
            >
              <LayoutDashboard size={19} />
              Dashboard
            </Link>

            <Link
              to="/user/tickets"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition"
            >
              <Ticket size={19} />
              My Tickets
            </Link>

            <Link
              to="/user/submit-complaint"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition"
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
              <p className="font-semibold truncate">{userName}</p>
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
        <header className="bg-white px-5 sm:px-8 py-5 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">
              User Portal / Dashboard
            </p>

            <h1 className="text-xl sm:text-2xl font-bold text-[#173B57]">
              My Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="font-semibold text-[#173B57]">
                {userName}
              </p>

              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>

            <div className="w-10 h-10 rounded-full bg-[#12A89D] text-white flex items-center justify-center">
              <UserRound size={21} />
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="p-5 sm:p-8">
          {/* Welcome Section */}
          <section className="bg-[#173B57] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-[#12A89D] font-semibold mb-2">
                WELCOME BACK!
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Hello, {userName}!
              </h2>

              <p className="text-gray-300 max-w-xl">
                Manage your complaints, track their progress and
                stay updated on every resolution.
              </p>
            </div>

            <Link
              to="/user/submit-complaint"
              className="bg-[#12A89D] hover:bg-[#0E8E85] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition whitespace-nowrap"
            >
              <PlusCircle size={20} />
              New Complaint
            </Link>
          </section>

          {/* Statistics */}
          <section className="mt-8">
            <h2 className="text-lg font-bold text-[#173B57] mb-5">
              Complaint Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.title}
                    className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500 mb-2">
                          {stat.title}
                        </p>

                        <h3 className="text-3xl font-bold text-[#173B57]">
                          {loading ? "..." : stat.value}
                        </h3>
                      </div>

                      <div className={`p-3 rounded-xl ${stat.color}`}>
                        <Icon size={25} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Recent Complaints */}
          <section className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 p-5 border-b">
              <div>
                <h2 className="text-lg font-bold text-[#173B57]">
                  Recent Complaints
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Track your latest submitted complaints.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={fetchDashboardTickets}
                  disabled={loading}
                  className="text-gray-500 hover:text-[#12A89D] transition"
                  title="Refresh tickets"
                >
                  <RefreshCw
                    size={18}
                    className={loading ? "animate-spin" : ""}
                  />
                </button>

                <Link
                  to="/user/tickets"
                  className="text-[#12A89D] font-semibold text-sm flex items-center gap-2 hover:underline"
                >
                  View All
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-gray-500">
                Loading your complaints...
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <p className="text-red-600 mb-3">{error}</p>

                <button
                  onClick={fetchDashboardTickets}
                  className="bg-[#12A89D] text-white px-5 py-2 rounded-lg hover:bg-[#0E8E85]"
                >
                  Try Again
                </button>
              </div>
            ) : ownerDataMissing ? (
              <div className="p-6 text-center text-amber-700">
                Ticket owner information was not included in the API response.
                Please update the backend response or provide a user-specific
                tickets endpoint before displaying personal complaint data.
              </div>
            ) : recentTickets.length === 0 ? (
              <div className="py-12 text-center">
                <Ticket size={38} className="mx-auto text-gray-300 mb-3" />

                <p className="font-semibold text-gray-600">
                  No complaints found
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Submit your first complaint to get started.
                </p>

                <Link
                  to="/user/submit-complaint"
                  className="inline-flex items-center gap-2 mt-4 bg-[#12A89D] text-white px-5 py-2 rounded-lg hover:bg-[#0E8E85]"
                >
                  <PlusCircle size={17} />
                  Submit Complaint
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[750px]">
                  <thead className="bg-gray-50 text-gray-500 text-sm">
                    <tr>
                      <th className="px-5 py-4 font-semibold">
                        Ticket ID
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Subject
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Category
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Priority
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Status
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {recentTickets.map((ticket) => {
                      const databaseId = getTicketId(ticket);
                      const status = ticket.status || "OPEN";
                      const priority = ticket.priority || "N/A";

                      return (
                        <tr
                          key={databaseId}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-5 py-4 text-sm font-semibold text-[#173B57]">
                            {getDisplayTicketId(ticket)}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-700">
                            {ticket.subject || "Untitled complaint"}
                          </td>

                          <td className="px-5 py-4 text-sm text-gray-600">
                            {ticket.category || "Unclassified"}
                          </td>

                          <td
                            className={`px-5 py-4 text-sm font-semibold ${getPriorityStyle(
                              priority
                            )}`}
                          >
                            {priority}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                                status
                              )}`}
                            >
                              {String(status).replaceAll("_", " ")}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {databaseId != null ? (
                              <Link
                                to={`/user/tickets/${databaseId}`}
                                className="text-[#12A89D] font-semibold text-sm hover:underline"
                              >
                                View
                              </Link>
                            ) : (
                              <span className="text-gray-400 text-sm">
                                Unavailable
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Quick Actions */}
          <section className="mt-8">
            <h2 className="text-lg font-bold text-[#173B57] mb-5">
              Quick Actions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Link
                to="/user/submit-complaint"
                className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 flex items-center gap-4 hover:shadow-md transition"
              >
                <div className="bg-teal-100 text-[#12A89D] p-4 rounded-xl">
                  <PlusCircle size={27} />
                </div>

                <div>
                  <h3 className="font-bold text-[#173B57]">
                    Submit a Complaint
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Report a new issue or problem.
                  </p>
                </div>

                <ArrowRight className="ml-auto text-gray-400" />
              </Link>

              <Link
                to="/user/tickets"
                className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 flex items-center gap-4 hover:shadow-md transition"
              >
                <div className="bg-blue-100 text-blue-600 p-4 rounded-xl">
                  <FileText size={27} />
                </div>

                <div>
                  <h3 className="font-bold text-[#173B57]">
                    View My Tickets
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Check complaint history and status.
                  </p>
                </div>

                <ArrowRight className="ml-auto text-gray-400" />
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center text-sm text-gray-500 mt-10 py-5 border-t">
            © 2026 TriageSync. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
