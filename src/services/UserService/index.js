import api from "../axios";
import { getAll } from "./urls";
const getUser = async () => await api.get(`${getAll}`);

export const UserService = {
  getUser,
};
