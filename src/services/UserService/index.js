import api from "../00-Axios";
import { getAll, getMe, updateProfile } from "./urls";
const getUser = async () => await api.get(`${getAll}`);
const fetchMe = async () => await api.get(`${getMe}`);
const updateUserProfile = async (userId, data) => await api.put(updateProfile(userId), data);

export const UserService = {
  getUser,
  fetchMe,
  updateUserProfile,
};
