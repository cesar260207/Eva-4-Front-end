import { apiRequest } from "./apiClient"

export function getSports() {
  return apiRequest("/sports", { method: "GET" })
}

export function getSportById(id) {
  return apiRequest(`/sport/${encodeURIComponent(id)}`, { method: "GET" })
}

export function createSport(payload) {
  return apiRequest("/sports", {
    method: "POST",
    json: payload,
  })
}

export function updateSport(id, payload) {
  return apiRequest(`/sports/${encodeURIComponent(id)}`, {
    method: "PUT",
    json: payload,
  })
}

export function deleteSport(id) {
  return apiRequest(`/sports/${encodeURIComponent(id)}`, {
    method: "DELETE",
  })
}

export function updateSportStatus(id, status) {
  return apiRequest(`/sports/${encodeURIComponent(id)}/status`, {
    method: "PATCH",
    json: { status },
  })
}
