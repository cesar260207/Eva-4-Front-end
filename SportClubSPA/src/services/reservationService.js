import { apiRequest } from "./apiClient";

export const getMyReservations = ()     => apiRequest("/reservations/my-reservations");
export const createReservation = (data) => apiRequest("/reservations", { method: "POST", json: data });
export const cancelReservation = (id)   => apiRequest(`/reservations/${id}/cancel`, { method: "PATCH" });
