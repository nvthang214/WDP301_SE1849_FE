import { get } from "lodash";
import api from "../00-Axios";
import { dashboard, accountSettings, companyInfo, socialMedia, stats, recentJobs } from "./urls";

const getDashboardData = async () => await api.get(dashboard, {params: {}});

export const RecruiterService = {
  getDashboardData,
  getAccountSettings: async () => await api.get(accountSettings, {params: {}}),
  getCompanyInfo: async () => await api.get(companyInfo, {params: {}}),
  getSocialMedia: async () => await api.get(socialMedia, {params: {}}),
  getStats: async () => await api.get(stats),
  getRecentJobs: async () => await api.get(recentJobs)
};