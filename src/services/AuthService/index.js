import api from "../00-Axios";
import { forgotPasswordurl, loginurl, registerurl, resetPasswordurl } from "./urls";

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

const forgotPassword = async (payload) => {
  return await api.post(forgotPasswordurl, payload);
};

const resetPassword = async (payload, token) => {
  return await api.post(resetPasswordurl + `/${token}`, payload);
};

export const AuthService = {
  login,
  register,
  forgotPassword,
  resetPassword,
};
