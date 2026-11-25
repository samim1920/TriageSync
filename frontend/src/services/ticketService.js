
import api from "./api";

// Create a new ticket
export const createTicket = async (ticketData) => {
  const response = await api.post("/tickets", ticketData);
  return response.data;
};

// Get all tickets
export const getAllTickets = async () => {
  const response = await api.get("/tickets");
  return response.data;
};

// Get ticket by database ID
export const getTicketById = async (ticketId) => {
  const response = await api.get(
    `/tickets/${encodeURIComponent(ticketId)}`
  );
  return response.data;
};

// Get ticket by external ID
export const getTicketByExternalId = async (externalId) => {
  const response = await api.get(
    `/tickets/external/${encodeURIComponent(externalId)}`
  );
  return response.data;
};

// Update category, priority, status or assignee
export const updateTicket = async (ticketId, ticketData) => {
  const response = await api.patch(
    `/tickets/${encodeURIComponent(ticketId)}`,
    ticketData
  );
  return response.data;
};

// Update category
export const updateTicketCategory = async (ticketId, category) => {
  const response = await api.patch(
    `/tickets/${encodeURIComponent(ticketId)}/category`,
    null,
    { params: { category } }
  );
  return response.data;
};

// Update priority
export const updateTicketPriority = async (ticketId, priority) => {
  const response = await api.patch(
    `/tickets/${encodeURIComponent(ticketId)}/priority`,
    null,
    { params: { priority } }
  );
  return response.data;
};

// Update status
export const updateTicketStatus = async (ticketId, status) => {
  const response = await api.patch(
    `/tickets/${encodeURIComponent(ticketId)}/status`,
    null,
    { params: { status } }
  );
  return response.data;
};

// Assign ticket to a user
export const assignTicket = async (ticketId, assigneeId) => {
  const response = await api.patch(
    `/tickets/${encodeURIComponent(ticketId)}/assign/${encodeURIComponent(assigneeId)}`
  );
  return response.data;
};

// Automatically reclassify a ticket
export const reclassifyTicket = async (ticketId) => {
  const response = await api.post(
    `/tickets/${encodeURIComponent(ticketId)}/reclassify`
  );
  return response.data;
};

// Delete ticket
export const deleteTicket = async (ticketId) => {
  await api.delete(`/tickets/${encodeURIComponent(ticketId)}`);
  return true;
};
