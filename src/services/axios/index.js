// src/services/api.js
import axios from "axios";

import { notifyError } from "../../components/Notification";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  timeout: 15000,
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
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
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
    const authPaths = ["/auth/login", "/auth/register", "/auth/refresh"];

    // Nếu request là một trong các auth endpoints -> đẩy lỗi ra component (không redirect ở đây)
    if (authPaths.some((p) => originalRequest.url?.includes(p))) {
      // thông báo lỗi tuỳ backend (interceptor chung có thể vẫn notify)
      const msg = error.response?.data?.msg || "Đã xảy ra lỗi";
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
        // Gọi thẳng endpoint refresh (dùng axios để tránh loop với instance)
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshRes.data?.data?.token;
        if (!newToken) throw new Error("No token from refresh");

        localStorage.setItem("accessToken", newToken);
        api.defaults.headers.Authorization = `Bearer ${newToken}`;
        processQueue(null, newToken);

        // Retry original request với token mới
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("accessToken"); // xóa access token / state auth
        // Redirect ở đây chỉ khi refresh fail (nghĩa là user thực sự cần login lại)
        window.location.href = "/login";
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
