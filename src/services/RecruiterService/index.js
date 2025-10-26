import { get } from "lodash";
import api from "../00-Axios";
import {  accountSettings, companyInfo, socialMedia, stats, recentJobs } from "./urls";


export const RecruiterService = {
  getAccountSettings: async () => await api.get(accountSettings, {params: {}}),
  getCompanyInfo: async () => await api.get(companyInfo, {params: {}}),
  getSocialMedia: async () => await api.get(socialMedia, {params: {}}),
  getStats: async () => await api.get(stats),
  getRecentJobs: async () => await api.get(recentJobs)
};