import api from "../00-Axios";
import { 
  getAll, 
  getById, 
  postJob, 
  updateJob, 
  activateJob,
  getCompanyOfRecruiter,
  getJobsOfRecruiter,
  toggleFavorite,
  getNumberOfApplicationsByJobId,
  getApplicationsByJobId,
  toggleJobStatus
} from "./urls";

// Add params to getJobs
const getJobs = async (flag, params = {}) => await api.get(getAll(flag), { params });
// 

export const JobService = {
  getJobs,
  getJobById: async (flag, id) => await api.get(getById(flag, id)),
  postJob: async (data) => await api.post(postJob, data),
  updateJob: async (id, data) => await api.put(updateJob(id), data),
  activateJob: async (id) => await api.put(activateJob(id)),
  getCompanyOfRecruiter: async () => await api.get(getCompanyOfRecruiter()),
  getJobsOfRecruiter: async (params = {}) => await api.get(getJobsOfRecruiter(), { params }),
  toggleFavoriteJob: async (jobId) => await api.post(toggleFavorite(jobId)),
  getNumberOfApplicationsByJobId: async (jobId) => await api.get(getNumberOfApplicationsByJobId(jobId)),
  getApplicationsByJobId: async (jobId) => await api.get(getApplicationsByJobId(jobId)),
  toggleJobStatus: async (id) => await api.patch(toggleJobStatus(id)),
};