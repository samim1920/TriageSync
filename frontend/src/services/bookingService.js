
import api from "./api";

// Get bookings of logged-in user
export const getMyBookings = async () => {
  const response = await api.get("/bookings/my");
  return response.data;
};

// Get booking details by ID
export const getBookingById = async (bookingId) => {
  const response = await api.get(`/bookings/${bookingId}`);
  return response.data;
};

// Create a new resource booking
export const createBooking = async (bookingData) => {
  const response = await api.post("/bookings", bookingData);
  return response.data;
};

// Cancel own booking
export const cancelBooking = async (bookingId) => {
  const response = await api.patch(
    `/bookings/${bookingId}/cancel`
  );
  return response.data;
};

// Approve booking (Admin)
export const approveBooking = async (bookingId) => {
  const response = await api.patch(
    `/bookings/${bookingId}/approve`
  );
  return response.data;
};

// Reject booking (Admin)
export const rejectBooking = async (bookingId, note) => {
  const response = await api.patch(
    `/bookings/${bookingId}/reject`,
    { note }
  );
  return response.data;
};
