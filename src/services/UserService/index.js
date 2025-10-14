import api from "../00-Axios";
import { getAll } from "./urls";
const getUser = async () => await api.get(`${getAll}`);

export const UserService = {
  getUser,
};
