import api from "../00-Axios";
import {
  forgotPasswordurl,
  loginurl,
  loginWithGoogleUrl,
  logouturl,
  refreshurl,
  registerurl,
  resetPasswordurl,
  changePasswordUrl,
  verifyEmailUrl,
} from "./urls";

const login = async (payload, config = {}) => api.post(loginurl, payload, config);

const loginWithGoogle = async (token, config = {}) => api.post(loginWithGoogleUrl, token, config);

const register = async (payload, config = {}) => api.post(registerurl, payload, config);

const forgotPassword = async (payload, config = {}) => api.post(forgotPasswordurl, payload, config);

const resetPassword = async (payload, token, config = {}) =>
  api.post(`${resetPasswordurl}/${token}`, payload, config);

const logout = async (config = {}) => api.get(logouturl, config);

const refresh = async (config = {}) => api.get(refreshurl, config);

const changePassword = async (payload, config = {}) => api.put(changePasswordUrl, payload, config);
const verifyEmail = async (token, config = {}) => api.get(`${verifyEmailUrl}/${token}`, config);

export const AuthService = {
  login,
  register,
  forgotPassword,
  resetPassword,
  loginWithGoogle,
  logout,
  refresh,
  changePassword,
  verifyEmail,
};
