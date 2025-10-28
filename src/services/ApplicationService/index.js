import api from "../00-Axios";
import { getAll, getById, updateApplicationStatus, getApplicationsByJobId, filterApplicationsByStatus, getAllApplicationsByRecruiter, getShortlistedApplicationsByRecruiter } from "./url";

export const ApplicationService = {
  getAll: async () => {
    const response = await api.get(getAll);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(getById(id));
    return response.data;
  },
  updateApplicationStatus: async (id, status) => {
    const response = await api.put(updateApplicationStatus(id), { status });
    return response.data;
  },

  getApplicationsByJobId: async (jobId) => {
    const response = await api.get(getApplicationsByJobId(jobId));
    return response.data;
  },
  filterApplicationsByStatus: async (jobId, status) => {
    const response = await api.get(filterApplicationsByStatus(jobId), { params: { status } });
    return response.data;
  },
  
  getAllApplicationsByRecruiter: async () => {
    const response = await api.get(getAllApplicationsByRecruiter);
    return response.data;
  },
  
  getShortlistedApplicationsByRecruiter: async () => {
    const response = await api.get(getShortlistedApplicationsByRecruiter);
    return response.data;
  },
};
