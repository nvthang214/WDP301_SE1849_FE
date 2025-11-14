import { io } from "socket.io-client";

const DEFAULT_API_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000/api";

const resolveSocketUrl = () => {
  const explicit = import.meta.env.VITE_SOCKET_URL;
  if (explicit && typeof explicit === "string") {
    return explicit.trim().replace(/\/$/, "");
  }
  return DEFAULT_API_URL.replace(/\/?api\/?$/, "");
};

class SocketService {
  constructor() {
    this.socket = null;
    this.token = null;
    this.role = "guest";
  }

  connect({ token, role } = {}) {
    const targetRole = role || "guest";
    const socketUrl = resolveSocketUrl();

    const shouldReuse =
      this.socket &&
      this.socket.connected &&
      this.token === (token || null) &&
      this.role === targetRole;

    if (shouldReuse) {
      return this.socket;
    }

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.token = token || null;
    this.role = targetRole;

    this.socket = io(socketUrl, {
      transports: ["websocket"],
      withCredentials: true,
      auth: token ? { token } : undefined,
      query: { role: targetRole },
      reconnection: true,
      reconnectionAttempts: 5,
      autoConnect: true,
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
    }
    this.socket = null;
    this.token = null;
    this.role = "guest";
  }

  on(event, handler) {
    if (!this.socket) return () => {};
    this.socket.on(event, handler);
    return () => this.socket?.off(event, handler);
  }

  emit(event, payload) {
    if (!this.socket) return;
    this.socket.emit(event, payload);
  }

  isConnected() {
    return Boolean(this.socket?.connected);
  }

  getSocket() {
    return this.socket;
  }
}

export default new SocketService();
