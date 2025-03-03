import { io } from "socket.io-client";

const SERVER_URL = "http://localhost:8080";

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
