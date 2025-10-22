import { get } from "lodash";
import api from "../00-Axios";
import { getProfile, updateProfile, getJobsByRecruiterId } from "./urls";


export const RecruiterService = {
  getProfile: async (id) => await api.get(getProfile(id)),
  updateProfile: async (id, data) => await api.put(updateProfile(id), data),
  getJobsByRecruiterId: async (recruiterId) => await api.get(getJobsByRecruiterId(recruiterId)),
};