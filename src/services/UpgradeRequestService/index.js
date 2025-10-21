import api from "../00-Axios";
import { upgradeRequestUrls } from "./urls";

// Candidate services
const createUpgradeRequest = async (formData) => {
  return await api.post(upgradeRequestUrls.create, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const getMyUpgradeRequest = async () => {
  return await api.get(upgradeRequestUrls.getMyRequest);
};

// Admin services
const getAllUpgradeRequests = async (status = null) => {
  const url = status ? `${upgradeRequestUrls.getAll}?status=${status}` : upgradeRequestUrls.getAll;
  return await api.get(url);
};

const getUpgradeRequestById = async (requestId) => {
  return await api.get(upgradeRequestUrls.getById(requestId));
};

const reviewUpgradeRequest = async (requestId, status, adminNote = '') => {
  return await api.put(upgradeRequestUrls.review(requestId), {
    status,
    adminNote,
  });
};

const getUpgradeRequestStats = async () => {
  return await api.get(upgradeRequestUrls.getStats);
};

export const UpgradeRequestService = {
  // Candidate
  createUpgradeRequest,
  getMyUpgradeRequest,
  
  // Admin
  getAllUpgradeRequests,
  getUpgradeRequestById,
  reviewUpgradeRequest,
  getUpgradeRequestStats,
};
