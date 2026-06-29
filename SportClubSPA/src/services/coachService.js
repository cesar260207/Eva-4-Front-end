import { apiRequest } from "./apiClient";

export const getMyClasses   = () => apiRequest("/coach/my-classes");
export const getMySchedules = () => apiRequest("/coach/my-schedules");
export const getMyRooms     = () => apiRequest("/coach/my-rooms");
