import { io } from "socket.io-client";

const SERVER_URL = "https://vybsync-back-production.up.railway.app";

export const socket = io(SERVER_URL, {
  transports: ["websocket"],
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
