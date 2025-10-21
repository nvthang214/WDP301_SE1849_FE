import api from "../00-Axios";
import { getAll, getMe } from "./urls";
const getUser = async () => await api.get(`${getAll}`);
const fetchMe = async () => await api.get(`${getMe}`);

export const UserService = {
  getUser,
  fetchMe,
};
