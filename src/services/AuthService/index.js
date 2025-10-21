import api from "../00-Axios";
import {
  forgotPasswordurl,
  loginurl,
  loginWithGoogleUrl,
  logouturl,
  refreshurl,
  registerurl,
  resetPasswordurl,
} from "./urls";

const login = async (payload) => {
  const res = await api.post(loginurl, payload);
  return res;
};
const loginWithGoogle = async (token) => {
  const res = await api.post(loginWithGoogleUrl, token);
  if (res?.data?.token) {
    localStorage.setItem("accessToken", res.data.token);
  }
  return res;
};
const register = async (payload) => {
  const res = await api.post(registerurl, payload);
  return res;
};

const forgotPassword = async (payload) => {
  return await api.post(forgotPasswordurl, payload);
};

const resetPassword = async (payload, token) => {
  return await api.post(resetPasswordurl + `/${token}`, payload);
};

const logout = async () => {
  return await api.get(logouturl);
};

const refresh = async () => {
  return await api.get(refreshurl);
};

export const AuthService = {
  login,
  register,
  forgotPassword,
  resetPassword,
  loginWithGoogle,
  logout,
  refresh,
};
