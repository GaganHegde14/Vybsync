import * as React from "react";
import Sheet from "@mui/joy/Sheet";
import MessagesPane from "./MessagesPane";
import ChatsPane from "./ChatsPane";
import { socket, connectSocket, disconnectSocket } from "../socket";
import { useState, useEffect } from "react";

export default function MyMessages() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    connectSocket();

    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await fetch("http://localhost:8080/api/chat", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch chats");
        }

        const data = await response.json();
        console.log("Fetched Chats in MyMessages:", data);
        setChats(data);

        if (data.length > 0 && !selectedChat) {
          setSelectedChat(data[0]);
        }
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    fetchChats();

    socket.on("messageReceived", (message) => {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === message.chat._id
            ? { ...chat, latestMessage: message }
            : chat
        )
      );
    });

    return () => {
      disconnectSocket();
      socket.off("messageReceived");
    };
  }, []);

  return (
    <Sheet
      sx={{
        flex: 1,
        width: "100%",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "30% 1fr" },
      }}
    >
      <ChatsPane
        chats={chats}
        setChats={setChats}
        selectedChatId={selectedChat?._id}
        setSelectedChat={setSelectedChat}
      />
      {selectedChat && <MessagesPane chat={selectedChat} />}
    </Sheet>
  );
}
