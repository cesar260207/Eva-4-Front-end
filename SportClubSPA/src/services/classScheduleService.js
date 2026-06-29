import { apiRequest } from "./apiClient";

export const getClassSchedules = () => apiRequest("/class-schedules");

export const createClassSchedule = (data) => 
  apiRequest("/class-schedules", { method: "POST", json: data }); 

export const updateClassSchedule = (id, data) => 
  apiRequest(`/class-schedules/${id}`, { method: "PUT", json: data }); 

export const deleteClassSchedule = (id) => 
  apiRequest(`/class-schedules/${id}`, { method: "DELETE" });