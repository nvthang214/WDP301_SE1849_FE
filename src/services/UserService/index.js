import api from "../00-Axios";
import { 
  getAll, 
  getUserProfile, 
  updateUserProfile, 
  getUserById, 
  changePassword 
} from "./urls";

const getUser = async () => await api.get(`${getAll}`);

const getUserProfileById = async (userId) => await api.get(getUserProfile(userId));

const updateProfile = async (userId, data) => await api.put(updateUserProfile(userId), data);

const getUserDetails = async (userId) => await api.get(getUserById(userId));

const changeUserPassword = async (data) => await api.put(changePassword, data);

export const UserService = {
  getUser,
  getUserProfileById,
  updateProfile,
  getUserDetails,
  changeUserPassword,
};
