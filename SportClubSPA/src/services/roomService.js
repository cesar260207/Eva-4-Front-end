import { apiRequest } from "./apiClient";

// Asegúrate de usar /rooms (plural)
export function getRooms() {
  return apiRequest("/rooms", { method: "GET" });
}

export function createRoom(payload) {
  return apiRequest("/rooms", { method: "POST", json: payload });
}

export function updateRoom(id, payload) {
  return apiRequest(`/rooms/${encodeURIComponent(id)}`, { method: "PUT", json: payload });
}

export function deleteRoom(id) {
  return apiRequest(`/rooms/${encodeURIComponent(id)}`, { method: "DELETE" });
}