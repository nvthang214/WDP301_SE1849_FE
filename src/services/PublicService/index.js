import api from "../00-Axios/index.js";
import { getPublicStats } from "./urls.js";

export const fetchPublicStats = async () => {
  const response = await api.get(getPublicStats());
  return response.data?.data || response.data;
};

