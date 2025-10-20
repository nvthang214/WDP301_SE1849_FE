import api from "../00-Axios";
import { forgotPasswordurl, loginurl, registerurl, resetPasswordurl, changePasswordurl } from "./urls";

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

const changePassword = async (payload) => {
  // TODO: Remove this mock when backend implements the endpoint
  // Temporary mock for testing UI
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate validation
      if (payload.currentPassword === "wrong") {
        reject({
          response: {
            status: 400,
            data: { message: "Mật khẩu hiện tại không đúng!" }
          }
        });
      } else {
        resolve({
          data: { message: "Đổi mật khẩu thành công!" }
        });
      }
    }, 1000);
  });
};


export const AuthService = {
  login,
  register,
  forgotPassword,
  resetPassword,
  changePassword,
};
