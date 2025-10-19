import api from "../00-Axios";
import { 
  getAll, 
  getById, 
  postJob, 
  updateJob, 
  deactivateJob,
  activateJob,
  getCompanyByRecruiterId,
  getJobsByRecruiterId,
} from "./urls";

// Thêm params vào getJobs
const getJobs = async (params = {}) => await api.get(getAll, { params });

export const JobService = {
  getJobs,
  getJobById: async (id) => await api.get(getById(id)),
  postJob: async (data) => await api.post(postJob, data),
  updateJob: async (id, data) => await api.put(updateJob(id), data),
  deactivateJob: async (id) => await api.put(deactivateJob(id)),
  activateJob: async (id) => await api.put(activateJob(id)),
  getCompanyByRecruiterId: async (recruiterId) => await api.get(getCompanyByRecruiterId(recruiterId)),
  getJobsByRecruiterId: async (recruiterId) => await api.get(getJobsByRecruiterId(recruiterId)),
};