import api from "../00-Axios";
import { adminUrls } from "./urls";

// User Management Services
const getAllUsers = async () => {
  return await api.get(adminUrls.getAllUsers);
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
const getAllJobs = async () => {
  return await api.get(adminUrls.getAllJobs);
};

const toggleJobVisibility = async (jobId, isActive) => {
  return await api.put(adminUrls.toggleJobVisibility(jobId), { isActive });
};

const deleteJob = async (jobId) => {
  return await api.delete(adminUrls.deleteJob(jobId));
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
};
