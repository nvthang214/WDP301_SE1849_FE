import api from "../00-Axios";
import { loginurl, registerurl } from "./urls";

const login = async (payload) => {
  const res = await api.post(loginurl, payload);
  if (res?.data?.token) {
    localStorage.setItem("accessToken", res.data.token);
  }
  return res;
};
const register = async (payload) => {
  return await api.post(registerurl, payload);
};

export const AuthService = {
  login,
  register,
};
