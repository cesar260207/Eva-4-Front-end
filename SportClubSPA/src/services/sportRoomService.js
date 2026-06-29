import { apiRequest } from "./apiClient";

// Obtener todas las asignaciones existentes
export function getSportRooms() {
  return apiRequest("/sport-rooms", { method: "GET" });
}

// Crear una nueva asignación (Vincular Deporte, Sala y Coach)
export function assignSportToRoom(payload) {
  // payload debería ser: { sport_id, room_id, coach_id }
  return apiRequest("/sport-rooms", { 
    method: "POST", 
    json: payload 
  });
}

// Eliminar una asignación
export function deleteAssignment(id) {
  return apiRequest(`/sport-rooms/${encodeURIComponent(id)}`, { 
    method: "DELETE" 
  });
}