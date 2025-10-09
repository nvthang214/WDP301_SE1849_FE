import axios from "axios";
import { notifyError } from "../../components/Notification/NotificationManager";

// const getToken = () => localStorage.getItem("token");

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    // const token = getToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const msg =
      error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.";
    notifyError({
      message: "Lỗi hệ thống",
      description: msg,
    });
    return Promise.reject(error);
  }
);

export default api;
