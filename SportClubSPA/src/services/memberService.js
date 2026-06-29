import { apiRequest } from "./apiClient";

export const getAvailableClasses = ()   => apiRequest("/member/classes");
export const getClassDetail      = (id) => apiRequest(`/member/classes/${id}`);
export const getMemberSports     = ()   => apiRequest("/member/sports");
export const getMemberRooms      = ()   => apiRequest("/member/rooms");
