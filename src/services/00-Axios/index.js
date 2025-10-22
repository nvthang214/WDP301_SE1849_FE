// src/services/api.js
import axios from "axios";

import { notifyError } from "../../components/Notification";
import useAuthStore from "../../store/useAuthStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (err, token = null) => {
  failedQueue.forEach((p) => (err ? p.reject(err) : p.resolve(token)));
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (err) => Promise.reject(err)
);

api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    // Nếu không có originalRequest (ví dụ lỗi network) thì reject ngay
    if (!originalRequest) {
      const msg = error.message || "Lỗi kết nối";
      notifyError(msg);
      return Promise.reject(error);
    }

    // DANH SÁCH các endpoint auth — không xử lý refresh/redirect cho chúng
    const authPaths = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/auth/logout",
      "/auth/oauth-google",
    ];

    // Nếu request là một trong các auth endpoints -> đẩy lỗi ra component (không redirect ở đây)
    if (authPaths.some((p) => originalRequest.url?.includes(p))) {
      // thông báo lỗi tuỳ backend (interceptor chung có thể vẫn notify)
      const msg = error.response?.data?.msg || "Đã xảy ra lỗi vui lòng thử lại.";
      notifyError(msg);
      return Promise.reject(error);
    }

    // XỬ LÝ 401 cho các request khác (thử refresh)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // chờ token mới rồi retry
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await axios.get(
          `${import.meta.env.VITE_BASE_URL || "http://localhost:4000/api"}/auth/refresh`,
          { withCredentials: true }
        );

        const newToken = refreshRes?.data?.data?.token;
        console.log(newToken);

        if (!newToken) throw new Error("No token from refresh");

        // Cập nhật ngay Zustand và default header
        useAuthStore.getState().setAccessToken(newToken);

        // Quan trọng: cập nhật lại header cho instance axios
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        processQueue(null, newToken);

        // Retry lại request cũ
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().clearState();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    // Các lỗi khác xử lý chung
    const msg = error.response?.data?.msg || "Đã xảy ra lỗi, vui lòng thử lại.";
    notifyError(msg);
    return Promise.reject(error);
  }
);

export default api;
