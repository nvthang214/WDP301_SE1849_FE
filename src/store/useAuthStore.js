import { create } from "zustand";
import { AuthService } from "../services/AuthService";
import { notifySuccess } from "../components/Notification";
import { UserService } from "../services/UserService";

const useAuthStore = create((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (token) => {
    set({ accessToken: token });
    if (token) {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  },

  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
    localStorage.removeItem("accessToken");
  },

  register: async (payload) => {
    try {
      set({ loading: true });
      return await AuthService.register(payload);
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  login: async (payload) => {
    try {
      set({ loading: true });
      const res = await AuthService.login(payload);
      const accessToken = res?.data?.token || null;
      get().setAccessToken(accessToken);
      await get().fetchMe();
      return res;
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    try {
      set({ loading: true });
      const res = await AuthService.logout();
      get().clearState();
      notifySuccess(res?.msg || "Đăng xuất!");
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const res = await UserService.fetchMe();
      const user = res?.data || null;
      set({ user });
      return res;
    } catch (error) {
      console.log(error);
      set({ user: null, accessToken: null });
    } finally {
      set({ loading: false });
    }
  },
  refresh: async () => {
    try {
      set({ loading: true });
      const { user, fetchMe, setAccessToken } = get();
      const res = await AuthService.refresh();
      const accessToken = res?.data || null;
      setAccessToken(accessToken);

      if (!user) {
        await fetchMe();
      }
      await get().fetchMe();
    } catch (error) {
      console.log(error);
      get().clearState();
    } finally {
      set({ loading: false });
    }
  },

  init: async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      set({ accessToken: token });
      try {
        await get().fetchMe();
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        // Nếu token không hợp lệ, xóa nó
        get().clearState();
      }
    }
  },
}));

export default useAuthStore;
