import api from "../00-Axios/index.js";
import { getPublicStats,getTopAppliedJobs } from "./urls.js";

export const fetchPublicStats = async () => {
  const response = await api.get(getPublicStats());
  return response.data?.data || response.data;
};

export const fetchTopAppliedJobs = async () => {
  const response = await api.get(getTopAppliedJobs());
  return response.data?.data || response.data;
};

