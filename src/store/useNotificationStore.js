import { create } from "zustand";
import { NotificationService } from "../services/NotificationService";
import useAuthStore from "./useAuthStore";
import { notifyError, notifyInfo, notifySuccess, notifyWarning } from "../components/Notification";

const initialState = {
  items: [],
  unread: 0,
  loading: false,
  initialized: false,
  pagination: null,
  connection: "disconnected",
};

const computeUnread = (items = []) =>
  items.reduce((acc, item) => (item?.isRead ? acc : acc + 1), 0);

const normalizeNotification = (raw = {}) => {
  const id = raw.id || raw._id || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return {
    id,
    title: raw.title || "",
    message: raw.message || "",
    category: raw.category || "general",
    priority: raw.priority || "info",
    audience: raw.audience || "global",
    recipientRole: raw.recipientRole || null,
    recipientId: raw.recipientId || raw.recipient || null,
    metadata: raw.metadata || {},
    action: raw.action || null,
    sender: raw.sender || null,
    isRead: Boolean(raw.isRead),
    readAt: raw.readAt || null,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || raw.createdAt || new Date().toISOString(),
  };
};

const showToastForNotification = (notification) => {
  const message = notification.title || notification.message;
  if (!message) return;

  const mapping = {
    success: notifySuccess,
    warning: notifyWarning,
    error: notifyError,
    info: notifyInfo,
  };

  const handler = mapping[notification.priority] || notifyInfo;
  handler(message);
};

const useNotificationStore = create((set, get) => ({
  ...initialState,

  fetchNotifications: async (params = {}) => {
    const { user } = useAuthStore.getState();
    const service = user ? NotificationService.fetch : NotificationService.fetchPublic;
    set({ loading: true });
    try {
      const response = await service({ limit: 30, ...params });
      const rawItems = Array.isArray(response?.data)
        ? response.data
        : (response?.data?.items ?? []);
      const items = rawItems.map(normalizeNotification);
      const unread = response?.meta?.unread ?? computeUnread(items);
      set({
        items,
        unread,
        pagination: response?.pagination ?? null,
        initialized: true,
        loading: false,
      });
      return items;
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  appendNotification: (notification, options = {}) => {
    const normalized = normalizeNotification(notification);
    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.id === normalized.id);
      const nextItems = [...state.items];
      if (existingIndex >= 0) {
        nextItems[existingIndex] = normalized;
      } else {
        nextItems.unshift(normalized);
        if (nextItems.length > 50) {
          nextItems.pop();
        }
      }
      return {
        items: nextItems,
        unread: computeUnread(nextItems),
      };
    });

    if (!options.silent && get().initialized) {
      showToastForNotification(normalized);
    }

    return normalized;
  },

  markAsReadLocal: (id) => {
    if (!id) return;
    set((state) => {
      const nextItems = state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              isRead: true,
              readAt: item.readAt || new Date().toISOString(),
            }
          : item
      );
      return {
        items: nextItems,
        unread: computeUnread(nextItems),
      };
    });
  },

  markAsRead: async (id) => {
    if (!id) return null;
    const { user } = useAuthStore.getState();
    if (!user) {
      get().markAsReadLocal(id);
      return null;
    }
    const response = await NotificationService.markRead(id);
    const updated = normalizeNotification(response?.data ?? response);
    set((state) => {
      const nextItems = state.items.map((item) => (item.id === updated.id ? updated : item));
      return {
        items: nextItems,
        unread: computeUnread(nextItems),
      };
    });
    return updated;
  },

  markAllAsRead: async () => {
    const { user } = useAuthStore.getState();
    if (!user) {
      set((state) => ({
        items: state.items.map((item) => ({
          ...item,
          isRead: true,
          readAt: item.readAt || new Date().toISOString(),
        })),
        unread: 0,
      }));
      return;
    }
    await NotificationService.markAllRead();
    set((state) => ({
      items: state.items.map((item) => ({
        ...item,
        isRead: true,
        readAt: item.readAt || new Date().toISOString(),
      })),
      unread: 0,
    }));
  },

  setConnectionStatus: (status) => set({ connection: status }),

  clear: () => set({ ...initialState }),
}));

export default useNotificationStore;
