import api from "../00-Axios";
import { adminUrls } from "./urls";

// User Management Services
const getAllUsers = async (params = {}) => {
  return await api.get(adminUrls.getAllUsers, { params });
};

const getUserById = async (userId) => {
  return await api.get(adminUrls.getUserById(userId));
};

const banUser = async (userId, isActive) => {
  return await api.put(adminUrls.banUser(userId), { isActive });
};

const updateUserRole = async (userId, roleId) => {
  return await api.put(adminUrls.updateUserRole(userId), { roleId });
};

// Role Management Services
const getAllRoles = async () => {
  return await api.get(adminUrls.getAllRoles);
};

// Job Management Services
const getAllJobs = async (params = {}) => {
  return await api.get(adminUrls.getAllJobs, { params });
};

const toggleJobVisibility = async (jobId, isActive) => {
  return await api.put(adminUrls.toggleJobVisibility(jobId), { isActive });
};

const deleteJob = async (jobId) => {
  return await api.delete(adminUrls.deleteJob(jobId));
};

// Overview Statistics Services
const getOverviewStats = async () => {
  return await api.get(adminUrls.getOverviewStats);
};

const getUserRegistrationStats = async (year = null) => {
  const url = year 
    ? `${adminUrls.getUserRegistrationStats}?year=${year}`
    : adminUrls.getUserRegistrationStats;
  return await api.get(url);
};

export const AdminService = {
  // User management
  getAllUsers,
  getUserById,
  banUser,
  updateUserRole,
  
  // Role management
  getAllRoles,
  
  // Job management
  getAllJobs,
  toggleJobVisibility,
  deleteJob,
  
  // Overview statistics
  getOverviewStats,
  getUserRegistrationStats,
};
