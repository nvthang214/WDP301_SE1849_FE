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
    set({ loading: true });
    try {
      const response = await AuthService.register(payload, { skipNotify: true });
      return {
        isOk: true,
        data: response?.data ?? null,
        msg: response?.msg,
      };
    } catch (error) {
      const message = error?.response?.data?.msg || error?.message || "Đăng ký thất bại.";
      return { isOk: false, msg: message, error };
    } finally {
      set({ loading: false });
    }
  },
  login: async (payload) => {
    set({ loading: true });
    try {
      const response = await AuthService.login(payload, { skipNotify: true });
      const token = response?.data?.token || response?.token || response?.data?.accessToken || null;

      if (token) {
        get().setAccessToken(token);
        await get().fetchMe();
      }

      return {
        isOk: Boolean(token),
        data: response?.data ?? null,
        msg: response?.msg,
      };
    } catch (error) {
      const message = error?.response?.data?.msg || error?.message || "Đăng nhập thất bại.";
      return { isOk: false, msg: message, error };
    } finally {
      set({ loading: false });
    }
  },
  loginWithGoogle: async (payload) => {
    set({ loading: true });
    try {
      const response = await AuthService.loginWithGoogle(payload, { skipNotify: true });
      const token = response?.data?.token || response?.token || response?.data?.accessToken || null;

      if (token) {
        get().setAccessToken(token);
        await get().fetchMe();
      }

      return {
        isOk: Boolean(token),
        data: response?.data ?? null,
        msg: response?.msg,
      };
    } catch (error) {
      const message = error?.response?.data?.msg || error?.message || "Đăng nhập thất bại.";
      return { isOk: false, msg: message, error };
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
      const user = res?.data || res?.user || null;
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
      const res = await AuthService.refresh({ skipNotify: true });
      const accessToken = res?.data?.token || res?.data || null;
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
