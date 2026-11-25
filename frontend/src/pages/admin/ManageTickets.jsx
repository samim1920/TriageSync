
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  RefreshCw,
  Ticket,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Trash2,
  X,
  User,
  Mail,
} from "lucide-react";
import api from "../../services/api";

const STATUSES = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH"];

const statusColors = {
  OPEN: "bg-yellow-100 text-yellow-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  RESOLVED: "bg-green-100 text-green-700",
  CLOSED: "bg-gray-100 text-gray-700",
};

const priorityColors = {
  LOW: "bg-green-100 text-green-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  HIGH: "bg-red-100 text-red-700",
};

const formatDate = (date) => {
  if (!date) return "N/A";
  const value = new Date(date);
  return Number.isNaN(value.getTime())
    ? "N/A"
    : value.toLocaleString();
};

export default function ManageTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updating, setUpdating] = useState(null);

  // Load all tickets from backend
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tickets");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content || [];

      setTickets(data);
    } catch (err) {
      console.error("Ticket loading error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load complaints. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Filter tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const keyword = search.toLowerCase();

      const matchesSearch = [
        ticket.externalId,
        ticket.subject,
        ticket.category,
        ticket.user?.name,
        ticket.user?.email,
      ].some((value) =>
        String(value || "").toLowerCase().includes(keyword)
      );

      const matchesStatus =
        statusFilter === "ALL" ||
        ticket.status === statusFilter;

      const matchesPriority =
        priorityFilter === "ALL" ||
        ticket.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, search, statusFilter, priorityFilter]);

  // Statistics
  const stats = {
    total: tickets.length,
    pending: tickets.filter((t) => t.status === "OPEN").length,
    progress: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    resolved: tickets.filter(
      (t) => ["RESOLVED", "CLOSED"].includes(t.status)
    ).length,
  };

  // Update status
  const handleStatusChange = async (id, status) => {
    try {
      setUpdating(id);

      await api.patch(`/tickets/${id}/status`, null, {
        params: { status },
      });

      await fetchTickets();

      setSelectedTicket((current) =>
        current?.id === id ? { ...current, status } : current
      );
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Status update failed."
      );
    } finally {
      setUpdating(null);
    }
  };

  // Update priority
  const handlePriorityChange = async (id, priority) => {
    try {
      setUpdating(id);

      await api.patch(`/tickets/${id}/priority`, null, {
        params: { priority },
      });

      await fetchTickets();

      setSelectedTicket((current) =>
        current?.id === id ? { ...current, priority } : current
      );
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Priority update failed."
      );
    } finally {
      setUpdating(null);
    }
  };

  // Delete ticket
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) {
      return;
    }

    try {
      setUpdating(id);

      await api.delete(`/tickets/${id}`);

      setTickets((previous) =>
        previous.filter((ticket) => ticket.id !== id)
      );

      setSelectedTicket(null);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Unable to delete complaint."
      );
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Manage Tickets
          </h1>
          <p className="mt-2 text-slate-500">
            Manage and monitor all submitted complaints.
          </p>
        </div>

        <button
          onClick={fetchTickets}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border bg-white px-5 py-3 font-semibold hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw
            size={18}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Complaints"
          value={stats.total}
          icon={<Ticket size={23} />}
          color="blue"
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          icon={<Clock size={23} />}
          color="yellow"
        />

        <StatCard
          title="In Progress"
          value={stats.progress}
          icon={<AlertTriangle size={23} />}
          color="purple"
        />

        <StatCard
          title="Resolved"
          value={stats.resolved}
          icon={<CheckCircle size={23} />}
          color="green"
        />
      </div>

      {/* Search and Filters */}
      <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative">
            <Search
              size={19}
              className="absolute left-3 top-3.5 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search complaints..."
              className="w-full rounded-lg border py-3 pl-10 pr-4 outline-none focus:border-teal-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border px-4 py-3 outline-none"
          >
            <option value="ALL">All Status</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-lg border px-4 py-3 outline-none"
          >
            <option value="ALL">All Priorities</option>
            {PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
          <button
            onClick={fetchTickets}
            className="ml-3 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Tickets Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="border-b p-5">
          <h2 className="text-xl font-bold text-slate-800">
            All Complaints
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Showing {filteredTickets.length} of {tickets.length} complaints
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <RefreshCw className="animate-spin text-teal-600" size={30} />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="py-16 text-center text-gray-500">
            No complaints found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-slate-50 text-sm text-slate-600">
                <tr>
                  <th className="px-5 py-4">Complaint</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Priority</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {ticket.subject}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {ticket.externalId}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {ticket.category || "N/A"}
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={ticket.priority || "MEDIUM"}
                        disabled={updating === ticket.id}
                        onChange={(e) =>
                          handlePriorityChange(ticket.id, e.target.value)
                        }
                        className={`rounded-full px-3 py-2 text-xs font-semibold ${priorityColors[ticket.priority] || ""}`}
                      >
                        {PRIORITIES.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={ticket.status || "OPEN"}
                        disabled={updating === ticket.id}
                        onChange={(e) =>
                          handleStatusChange(ticket.id, e.target.value)
                        }
                        className={`rounded-full px-3 py-2 text-xs font-semibold ${statusColors[ticket.status] || ""}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-500">
                      {formatDate(ticket.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          title="View details"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye size={19} />
                        </button>

                        <button
                          onClick={() => handleDelete(ticket.id)}
                          disabled={updating === ticket.id}
                          title="Delete complaint"
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={19} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white">

            <div className="flex items-center justify-between border-b p-5">
              <div>
                <h2 className="text-xl font-bold">Complaint Details</h2>
                <p className="text-sm text-gray-500">
                  {selectedTicket.externalId}
                </p>
              </div>

              <button onClick={() => setSelectedTicket(null)}>
                <X size={23} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <Detail label="Subject" value={selectedTicket.subject} />
              <Detail label="Description" value={selectedTicket.body} />
              <Detail label="Category" value={selectedTicket.category} />
              <Detail label="Priority" value={selectedTicket.priority} />
              <Detail label="Status" value={selectedTicket.status} />
              <Detail
                label="Submitted Date"
                value={formatDate(selectedTicket.createdAt)}
              />

              <div className="rounded-lg bg-slate-50 p-4">
                <h3 className="mb-3 font-semibold">Submitted By</h3>

                {selectedTicket.user ? (
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <User size={16} />
                      Name: {selectedTicket.user.name || "N/A"}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail size={16} />
                      Email: {selectedTicket.user.email || "N/A"}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Submitter information is not available.
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="w-full rounded-lg bg-teal-600 py-3 font-semibold text-white hover:bg-teal-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Statistics card
function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
    green: "bg-green-100 text-green-600",
  };

  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="mt-2 text-3xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className={`rounded-xl p-3 ${colors[color]}`}>
        {icon}
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 whitespace-pre-wrap font-medium text-slate-800">
        {value || "N/A"}
      </p>
    </div>
  );
}
