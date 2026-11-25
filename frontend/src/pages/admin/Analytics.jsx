

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Ticket,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  RefreshCw,
} from "lucide-react";
import api from "../../services/api";

const COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-amber-500",
  "bg-teal-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-green-500",
];

const normalizeArray = (response) => {
  const data = response?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.content)) return data.content;

  return [];
};

const getDate = (value) => {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatLabel = (value) =>
  String(value || "Unknown")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const Analytics = () => {
  const [tickets, setTickets] = useState([]);
  const [period, setPeriod] = useState("6MONTHS");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Fetch tickets from backend
  const fetchAnalytics = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await api.get("/tickets");
      setTickets(normalizeArray(response));
    } catch (err) {
      console.error("Analytics API error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load analytics data. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Calculate ticket statistics
  const stats = useMemo(() => {
    const countStatus = (status) =>
      tickets.filter((ticket) => ticket.status === status).length;

    const totalComplaints = tickets.length;
    const resolvedComplaints =
      countStatus("RESOLVED") + countStatus("CLOSED");

    const pendingComplaints = countStatus("OPEN");
    const inProgressComplaints = countStatus("IN_PROGRESS");

    const highPriority = tickets.filter(
      (ticket) => ticket.priority === "HIGH"
    ).length;

    const resolutionRate =
      totalComplaints > 0
        ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1)
        : "0.0";

    return {
      totalComplaints,
      resolvedComplaints,
      pendingComplaints,
      inProgressComplaints,
      highPriority,
      resolutionRate,
    };
  }, [tickets]);

  const {
    totalComplaints,
    resolvedComplaints,
    pendingComplaints,
    inProgressComplaints,
    highPriority,
    resolutionRate,
  } = stats;

  // Statistics cards
  const statCards = [
    {
      title: "Total Complaints",
      value: totalComplaints,
      icon: Ticket,
      color: "bg-blue-100 text-blue-700",
      description: "All registered complaints",
    },
    {
      title: "Resolved Complaints",
      value: resolvedComplaints,
      icon: CheckCircle,
      color: "bg-green-100 text-green-700",
      description: "Successfully completed",
    },
    {
      title: "Pending Complaints",
      value: pendingComplaints,
      icon: Clock,
      color: "bg-amber-100 text-amber-700",
      description: "Awaiting action",
    },
    {
      title: "High Priority",
      value: highPriority,
      icon: AlertTriangle,
      color: "bg-red-100 text-red-700",
      description: "Require urgent attention",
    },
  ];

  // Category-wise statistics
  const categoryData = useMemo(() => {
    const counts = {};

    tickets.forEach((ticket) => {
      const category =
        ticket.category || ticket.autoCategory || "OTHER";

      counts[category] = (counts[category] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count], index) => ({
        name,
        count,
        percentage:
          totalComplaints > 0
            ? (count / totalComplaints) * 100
            : 0,
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.count - a.count);
  }, [tickets, totalComplaints]);

  // Priority-wise statistics
  const priorityData = useMemo(() => {
    const priorities = [
      { name: "High Priority", key: "HIGH", color: "bg-red-500" },
      { name: "Medium Priority", key: "MEDIUM", color: "bg-amber-500" },
      { name: "Low Priority", key: "LOW", color: "bg-green-500" },
    ];

    return priorities.map((item) => ({
      ...item,
      count: tickets.filter(
        (ticket) => ticket.priority === item.key
      ).length,
    }));
  }, [tickets]);

  // Monthly complaints from actual createdAt values
  const monthlyData = useMemo(() => {
    const months = [];
    const numberOfMonths = period === "3MONTHS" ? 3 : 6;
    const now = new Date();

    for (let i = numberOfMonths - 1; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      const count = tickets.filter((ticket) => {
        const created = getDate(ticket.createdAt);

        return (
          created &&
          created.getMonth() === date.getMonth() &&
          created.getFullYear() === date.getFullYear()
        );
      }).length;

      months.push({
        month: date.toLocaleDateString("en-IN", {
          month: "short",
        }),
        complaints: count,
      });
    }

    return months;
  }, [tickets, period]);

  const maxMonthlyCount = Math.max(
    1,
    ...monthlyData.map((item) => item.complaints)
  );

  // Download CSV report
  const downloadReport = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Complaints", totalComplaints],
      ["Resolved Complaints", resolvedComplaints],
      ["Pending Complaints", pendingComplaints],
      ["In Progress Complaints", inProgressComplaints],
      ["High Priority", highPriority],
      ["Resolution Rate", `${resolutionRate}%`],
      [],
      ["Category", "Complaints"],
      ...categoryData.map((item) => [
        formatLabel(item.name),
        item.count,
      ]),
      [],
      ["Priority", "Complaints"],
      ...priorityData.map((item) => [
        item.name,
        item.count,
      ]),
      [],
      ["Month", "Complaints"],
      ...monthlyData.map((item) => [
        item.month,
        item.complaints,
      ]),
    ];

    const csvContent = rows
      .map((row) =>
        row
          .map(
            (cell) =>
              `"${String(cell ?? "").replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "triagesync-analytics.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <RefreshCw
            className="mx-auto animate-spin text-[#12A89D]"
            size={32}
          />
          <p className="mt-3 text-gray-500">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error && tickets.length === 0) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-8 text-center">
        <AlertTriangle
          className="mx-auto text-red-500"
          size={40}
        />
        <h2 className="mt-3 font-bold text-gray-800">
          Analytics unavailable
        </h2>
        <p className="mt-2 text-sm text-red-600">{error}</p>
        <button
          onClick={() => fetchAnalytics(true)}
          className="mt-5 rounded-lg bg-[#12A89D] px-5 py-2 text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F7FA] p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#173B57] sm:text-3xl">
            Analytics & Reports
          </h1>
          <p className="mt-2 text-gray-500">
            Monitor complaint performance and system statistics.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw
              size={18}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            onClick={downloadReport}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#12A89D] px-5 py-3 font-semibold text-white transition hover:bg-[#0E8E85]"
          >
            <Download size={19} />
            Export Report
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {item.title}
                  </p>
                  <h2 className="mt-2 text-3xl font-bold text-[#173B57]">
                    {item.value}
                  </h2>
                </div>

                <div className={`rounded-lg p-3 ${item.color}`}>
                  <Icon size={24} />
                </div>
              </div>

              <p className="text-xs text-gray-400">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Resolution Rate and Status Summary */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#173B57]">
                Resolution Rate
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Percentage of complaints resolved.
              </p>
            </div>
            <TrendingUp className="text-[#12A89D]" size={25} />
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="relative flex h-36 w-36 shrink-0 items-center justify-center">
              <svg
                viewBox="0 0 120 120"
                className="h-full w-full -rotate-90"
              >
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  stroke="#E5E7EB"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  stroke="#12A89D"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(Number(resolutionRate) / 100) * 301.59} 301.59`}
                  strokeLinecap="round"
                />
              </svg>

              <div className="absolute text-center">
                <h3 className="text-2xl font-bold text-[#173B57]">
                  {resolutionRate}%
                </h3>
                <p className="text-xs text-gray-400">
                  Resolved
                </p>
              </div>
            </div>

            <div className="min-w-40 flex-1 space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="h-3 w-3 rounded-full bg-[#12A89D]" />
                  Resolved
                </span>
                <span className="font-semibold text-[#173B57]">
                  {resolvedComplaints}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="h-3 w-3 rounded-full bg-gray-200" />
                  Remaining
                </span>
                <span className="font-semibold text-[#173B57]">
                  {totalComplaints - resolvedComplaints}
                </span>
              </div>

              <p className="border-t pt-3 text-xs text-gray-400">
                Based on {totalComplaints} total complaints.
              </p>
            </div>
          </div>
        </div>

        {/* Status Summary */}
        <div className="rounded-xl bg-[#173B57] p-6 text-white">
          <h2 className="mb-5 text-lg font-bold">
            Status Summary
          </h2>

          <div className="space-y-5">
            {[
              {
                label: "Resolved",
                count: resolvedComplaints,
                color: "bg-green-400",
              },
              {
                label: "In Progress",
                count: inProgressComplaints,
                color: "bg-blue-400",
              },
              {
                label: "Pending",
                count: pendingComplaints,
                color: "bg-amber-400",
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-gray-200">
                    {item.label}
                  </span>
                  <span className="font-semibold">
                    {item.count}
                  </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{
                      width: `${
                        totalComplaints > 0
                          ? (item.count / totalComplaints) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Complaints */}
      <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-[#173B57]">
              Monthly Complaints
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Complaint submission trend.
            </p>
          </div>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm outline-none focus:border-[#12A89D]"
          >
            <option value="6MONTHS">Last 6 Months</option>
            <option value="3MONTHS">Last 3 Months</option>
          </select>
        </div>

        <div className="flex h-64 items-end justify-between gap-3 border-b border-l border-gray-200 px-3 pb-2">
          {monthlyData.map((item) => (
            <div
              key={item.month}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <span className="text-xs font-semibold text-gray-600">
                {item.complaints}
              </span>

              <div
                className="w-full max-w-16 rounded-t-lg bg-[#12A89D] transition hover:bg-[#0E8E85]"
                style={{
                  height: `${
                    (item.complaints / maxMonthlyCount) * 80
                  }%`,
                  minHeight: item.complaints > 0 ? "4px" : "0px",
                }}
              />

              <span className="text-xs text-gray-500">
                {item.month}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category and Priority */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Category Statistics */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-teal-50 p-3">
              <BarChart3 className="text-[#12A89D]" size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#173B57]">
                Category-wise Complaints
              </h2>
              <p className="text-sm text-gray-500">
                Complaints by category.
              </p>
            </div>
          </div>

          {categoryData.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">
              No category data available.
            </p>
          ) : (
            <div className="space-y-5">
              {categoryData.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-gray-700">
                      {formatLabel(item.name)}
                    </span>
                    <span className="text-gray-500">
                      {item.count}
                    </span>
                  </div>

                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Priority Statistics */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-amber-50 p-3">
              <AlertTriangle className="text-amber-600" size={23} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#173B57]">
                Priority Distribution
              </h2>
              <p className="text-sm text-gray-500">
                Complaints by priority level.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {priorityData.map((item) => (
              <div key={item.key}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    {item.name}
                  </span>
                  <span className="text-gray-500">
                    {item.count}
                  </span>
                </div>

                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{
                      width: `${
                        totalComplaints > 0
                          ? (item.count / totalComplaints) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-400">
        © 2026 TriageSync Analytics. All rights reserved.
      </div>
    </div>
  );
};

export default Analytics;
