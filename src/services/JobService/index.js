import api from "../00-Axios";
import { 
  getAll, 
  getById, 
  postJob, 
  updateJob, 
  deactivateJob,
  activateJob,
  getCompanyOfRecruiter,
  getJobsOfRecruiter,
  toggleFavorite
} from "./urls";

// Thêm params vào getJobs
const getJobs = async (flag, params = {}) => await api.get(getAll(flag), { params });

export const JobService = {
  getJobs,
  getJobById: async (id) => await api.get(getById(id)),
  postJob: async (data) => await api.post(postJob, data),
  updateJob: async (id, data) => await api.put(updateJob(id), data),
  deactivateJob: async (id) => await api.put(deactivateJob(id)),
  activateJob: async (id) => await api.put(activateJob(id)),
  getCompanyOfRecruiter: async () => await api.get(getCompanyOfRecruiter()),
  getJobsOfRecruiter: async () => await api.get(getJobsOfRecruiter()),
  toggleFavoriteJob: async (jobId) => await api.post(toggleFavorite(jobId)),
};