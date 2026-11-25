
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Power,
  Building2,
  Monitor,
  Laptop,
  X,
  Save,
  Trash2,
  RefreshCw,
} from "lucide-react";
import api from "../../services/api";

const emptyForm = {
  name: "",
  type: "ROOM",
  capacity: "",
  description: "",
};

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all resources.
  const fetchResources = useCallback(async (initial = false) => {
    try {
      if (initial) setLoading(true);
      else setRefreshing(true);

      setError("");

      const response = await api.get("/resources");

      // ResourceController returns ResponseEntity<List<Resource>>.
      const data = response.data;

      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch resources error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to fetch resources from server."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchResources(true);
  }, [fetchResources]);

  // Statistics.
  const totalResources = resources.length;

  const activeResources = resources.filter(
    (item) => item.isActive === true
  ).length;

  const inactiveResources = totalResources - activeResources;

  const roomCount = resources.filter(
    (item) => item.type === "ROOM"
  ).length;

  const labCount = resources.filter(
    (item) => item.type === "LAB"
  ).length;

  const equipmentCount = resources.filter(
    (item) => item.type === "EQUIPMENT"
  ).length;

  // Search and filter.
  const filteredResources = useMemo(() => {
    return resources.filter((item) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        (item.name || "").toLowerCase().includes(searchText) ||
        (item.description || "").toLowerCase().includes(searchText);

      const matchesType =
        typeFilter === "ALL" || item.type === typeFilter;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "ACTIVE" && item.isActive === true) ||
        (statusFilter === "INACTIVE" && item.isActive === false);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [resources, search, typeFilter, statusFilter]);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (resource) => {
    setEditingId(resource.id);

    setFormData({
      name: resource.name || "",
      type: resource.type || "ROOM",
      capacity: String(resource.capacity ?? ""),
      description: resource.description || "",
    });

    setError("");
    setShowModal(true);
  };

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Create or update resource.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Resource name is required.");
      return;
    }

    const capacity = Number(formData.capacity);

    if (!Number.isInteger(capacity) || capacity < 1) {
      setError("Please enter a valid capacity.");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      type: formData.type,
      capacity,
      description: formData.description.trim(),
    };

    try {
      setSaving(true);

      if (editingId !== null) {
        await api.put(`/resources/${editingId}`, payload);
        setSuccess("Resource updated successfully.");
      } else {
        await api.post("/resources", payload);
        setSuccess("Resource created successfully.");
      }

      setShowModal(false);
      setEditingId(null);
      setFormData(emptyForm);

      await fetchResources(false);
    } catch (err) {
      console.error("Save resource error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to save resource."
      );
    } finally {
      setSaving(false);
    }
  };

  // Activate or deactivate resource.
  const handleToggleStatus = async (resource) => {
    const newStatus = !resource.isActive;

    try {
      setError("");
      setSuccess("");

      await api.patch(
        `/resources/${resource.id}/status`,
        null,
        {
          params: {
            active: newStatus,
          },
        }
      );

      setResources((previous) =>
        previous.map((item) =>
          item.id === resource.id
            ? { ...item, isActive: newStatus }
            : item
        )
      );

      setSuccess(
        newStatus
          ? "Resource activated successfully."
          : "Resource deactivated successfully."
      );
    } catch (err) {
      console.error("Update status error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to update resource status."
      );
    }
  };

  // Delete resource.
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resource?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.delete(`/resources/${id}`);

      setResources((previous) =>
        previous.filter((item) => item.id !== id)
      );

      setSuccess("Resource deleted successfully.");
    } catch (err) {
      console.error("Delete resource error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to delete resource."
      );
    }
  };

  const getResourceIcon = (type) => {
    if (type === "ROOM") return Building2;
    if (type === "LAB") return Laptop;
    return Monitor;
  };

  const getTypeStyle = (type) => {
    if (type === "ROOM") return "bg-blue-100 text-blue-700";
    if (type === "LAB") return "bg-purple-100 text-purple-700";
    return "bg-amber-100 text-amber-700";
  };

  const summary = [
    {
      title: "Total Resources",
      value: totalResources,
      icon: Building2,
      color: "bg-blue-100 text-blue-700",
    },
    {
      title: "Active Resources",
      value: activeResources,
      icon: Power,
      color: "bg-green-100 text-green-700",
    },
    {
      title: "Inactive Resources",
      value: inactiveResources,
      icon: Monitor,
      color: "bg-red-100 text-red-700",
    },
    {
      title: "Rooms / Labs / Equipment",
      value: `${roomCount} / ${labCount} / ${equipmentCount}`,
      icon: Laptop,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F2F7FA] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#173B57]">
            Resource Management
          </h1>
          <p className="text-gray-500 mt-2">
            Manage rooms, laboratories and equipment.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => fetchResources(false)}
            disabled={refreshing}
            className="flex items-center gap-2 border bg-white px-4 py-3 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-[#12A89D] hover:bg-[#0E8E85] text-white px-5 py-3 rounded-lg font-semibold"
          >
            <Plus size={20} />
            Add Resource
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {summary.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">{item.title}</p>
                  <h2 className="text-2xl font-bold text-[#173B57] mt-2">
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

      {/* Filters */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search resources..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-[#12A89D]"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-3 outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="ROOM">Room</option>
            <option value="LAB">Laboratory</option>
            <option value="EQUIPMENT">Equipment</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-3 outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Resource Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#173B57]">
            All Resources
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredResources.length} of {totalResources} resources
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[750px]">
            <thead className="bg-[#F2F7FA] text-gray-600 text-sm">
              <tr>
                <th className="px-5 py-4">Resource</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Capacity</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    Loading resources...
                  </td>
                </tr>
              ) : filteredResources.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-500">
                    No resources found.
                  </td>
                </tr>
              ) : (
                filteredResources.map((resource) => {
                  const Icon = getResourceIcon(resource.type);

                  return (
                    <tr key={resource.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-teal-50 rounded-lg">
                            <Icon size={21} className="text-[#12A89D]" />
                          </div>

                          <div>
                            <p className="font-semibold text-sm text-[#173B57]">
                              {resource.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {resource.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeStyle(resource.type)}`}
                        >
                          {resource.type}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {resource.capacity}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            resource.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {resource.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(resource)}
                            title="Edit"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(resource)}
                            title="Change status"
                            className={`p-2 rounded-lg ${
                              resource.isActive
                                ? "text-red-500 hover:bg-red-50"
                                : "text-green-600 hover:bg-green-50"
                            }`}
                          >
                            <Power size={18} />
                          </button>

                          <button
                            onClick={() => handleDelete(resource.id)}
                            title="Delete"
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h2 className="text-xl font-bold text-[#173B57]">
                  {editingId !== null ? "Edit Resource" : "Add New Resource"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Enter resource information.
                </p>
              </div>

              <button
                onClick={closeModal}
                disabled={saving}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Resource Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter resource name"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#12A89D]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Resource Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#12A89D]"
                >
                  <option value="ROOM">Room</option>
                  <option value="LAB">Laboratory</option>
                  <option value="EQUIPMENT">Equipment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  name="capacity"
                  min="1"
                  step="1"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Enter capacity"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#12A89D]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter description"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 outline-none focus:border-[#12A89D] resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-lg font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#12A89D] hover:bg-[#0E8E85] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Save size={18} />
                  {saving
                    ? "Saving..."
                    : editingId !== null
                    ? "Update Resource"
                    : "Save Resource"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resources;
