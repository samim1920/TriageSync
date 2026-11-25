
import api from "./api";

// Get all resources
export const getAllResources = async () => {
  const response = await api.get("/resources");
  return response.data;
};

// Get active resources
export const getActiveResources = async () => {
  const response = await api.get("/resources/active");
  return response.data;
};

// Get resource by ID
export const getResourceById = async (resourceId) => {
  const response = await api.get(`/resources/${resourceId}`);
  return response.data;
};

// Create a new resource
export const createResource = async (resourceData) => {
  const response = await api.post("/resources", resourceData);
  return response.data;
};

// Update resource
export const updateResource = async (resourceId, resourceData) => {
  const response = await api.put(
    `/resources/${resourceId}`,
    resourceData
  );
  return response.data;
};

// Delete resource
export const deleteResource = async (resourceId) => {
  await api.delete(`/resources/${resourceId}`);
  return true;
};

// Activate or deactivate resource
export const updateResourceStatus = async (resourceId, active) => {
  const response = await api.patch(
    `/resources/${resourceId}/status`,
    null,
    { params: { active } }
  );
  return response.data;
};

// Get resources by type
export const getResourcesByCategory = async (type) => {
  const response = await api.get(`/resources/type/${type}`);
  return response.data;
};

// Get active resources by type
export const getActiveResourcesByType = async (type) => {
  const response = await api.get(`/resources/active/type/${type}`);
  return response.data;
};
