import { useEffect, useRef } from "react";
import SocketService from "../../services/SocketService";
import useAuthStore from "../../store/useAuthStore";
import useNotificationStore from "../../store/useNotificationStore";

const RealtimeProvider = ({ children }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);

  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);
  const appendNotification = useNotificationStore((state) => state.appendNotification);
  const setConnectionStatus = useNotificationStore((state) => state.setConnectionStatus);
  const clearNotifications = useNotificationStore((state) => state.clear);
  const initialized = useNotificationStore((state) => state.initialized);

  const userId = user?._id || null;
  const role = user?.role?.name || "guest";

  const initializedRef = useRef(initialized);

  useEffect(() => {
    initializedRef.current = initialized;
  }, [initialized]);

  useEffect(() => {
    clearNotifications();
  }, [userId, clearNotifications]);

  useEffect(() => {
    const socket = SocketService.connect({ token: accessToken, role });

    setConnectionStatus(socket.connected ? "connected" : "connecting");

    const handleConnect = () => {
      setConnectionStatus("connected");
      fetchNotifications().catch(() => {});
    };

    const handleDisconnect = () => {
      setConnectionStatus("disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    const unsubscribeNotification = SocketService.on("notification:created", (payload) => {
      const normalized = appendNotification(payload);
      if (normalized?.metadata?.shouldRefreshUser) {
        const { fetchMe } = useAuthStore.getState();
        if (typeof fetchMe === "function") {
          fetchMe().catch(() => {});
        }
      }
    });

    if (!initializedRef.current) {
      fetchNotifications().catch(() => {});
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      unsubscribeNotification();
    };
  }, [accessToken, role, appendNotification, fetchNotifications, setConnectionStatus]);

  useEffect(() => {
    return () => {
      SocketService.disconnect();
    };
  }, []);

  return children;
};

export default RealtimeProvider;
