import api from "../00-Axios";

const withConfig = (params) => ({
  params,
  skipNotify: true,
});

export const NotificationService = {
  fetch: (params) => api.get("/notifications", withConfig(params)),
  fetchPublic: (params) => api.get("/public/notifications", withConfig(params)),
  markRead: (id) => api.patch(`/notifications/${id}/read`, {}, { skipNotify: true }),
  markAllRead: () => api.patch("/notifications/read-all", {}, { skipNotify: true }),
  create: (payload, config) => api.post("/notifications", payload, config),
};
