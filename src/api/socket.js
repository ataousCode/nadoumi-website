import { io } from "socket.io-client";
import { API_BASE_URL } from "./config";

let socket;

export const initiateSocketConnection = (token, roleName = 'user') => {
  if (socket?.connected) {
    console.log(`[Socket] Reusing active connection for ${roleName}...`);
    return socket;
  }

  if (socket) {
    console.log(`[Socket] Cleaning up previous inactive connection for ${roleName}...`);
    socket.disconnect();
  }

  console.log(`[Socket] Initializing fresh connection for ${roleName}...`);
  
  socket = io(API_BASE_URL.replace("/api", ""), {
    auth: {
      token,
    },
    transports: ["polling", "websocket"],
    upgrade: true,
    rememberUpgrade: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    timeout: 20000,
  });
  
  socket.on("connect", () => {
    console.log("Socket connected!");
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  return socket;
};

export const disconnectSocket = () => {
  console.log("Disconnecting socket...");
  if (socket) socket.disconnect();
};

export const joinConversation = (conversationId) => {
  if (socket) socket.emit("join:conversation", conversationId);
};

export const leaveConversation = (conversationId) => {
  if (socket) socket.emit("leave:conversation", conversationId);
};

export const sendTypingStatus = (conversationId, isTyping) => {
  if (socket) socket.emit("typing", { conversationId, isTyping });
};

export const subscribeToMessages = (cb) => {
  if (!socket) return;
  socket.on("message:new", (message) => {
    cb(message);
  });
};

export const subscribeToTyping = (cb) => {
  if (!socket) return;
  socket.on("user:typing", (data) => {
    cb(data);
  });
};

export const subscribeToPresence = (cb) => {
  if (!socket) return;
  socket.on("status:update", (data) => {
    cb(data);
  });
};

export const queryPresence = (userId) => {
  if (socket) socket.emit("presence:query", userId);
};

export const subscribeToPresenceResponse = (cb) => {
  if (!socket) return;
  socket.on("presence:res", (data) => {
    cb(data);
  });
};

export const getSocket = () => socket;
