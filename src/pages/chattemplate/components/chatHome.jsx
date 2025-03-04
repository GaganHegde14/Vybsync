import * as React from "react";
import { useState, useEffect } from "react";
import Sheet from "@mui/joy/Sheet";
import ChatsPane from "./ChatsPane";
import MessagesPane from "./MessagesPane";
import { socket } from "../socket";

export default function ChatHome({ section = "home" }) {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          "https://vybsync-back-production.up.railway.app/api/chat",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch chats");

        const data = await response.json();
        console.log("Fetched Chats:", data);

        // Default all chats to "home" unless they are group chats
        const updatedChats = data.map((chat) => ({
          ...chat,
          section: chat.isGroupChat ? "groups" : "home", // Groups to "groups", others to "home"
        }));

        const filteredChats = updatedChats.filter((chat) => {
          if (section === "home") return chat.section === "home";
          if (section === "work") return false; // No chats in Work
          if (section === "groups") return chat.isGroupChat; // Only group chats
          if (section === "unread") return false; // No chats in Unread
          return true;
        });

        setChats(filteredChats);

        if (filteredChats.length > 0 && !selectedChat) {
          setSelectedChat(filteredChats[0]);
        }
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    fetchChats();

    // Listen for new group creation
    socket.on("groupCreated", (newGroup) => {
      console.log("New group created via Socket.IO:", newGroup);
      setChats((prevChats) => {
        if (!prevChats.some((chat) => chat._id === newGroup._id)) {
          return [...prevChats, { ...newGroup, section: "groups" }];
        }
        return prevChats;
      });
    });

    return () => {
      socket.off("groupCreated");
    };
  }, [section]);

  const handleNewChat = (newChat) => {
    setChats((prevChats) => {
      if (!prevChats.some((chat) => chat._id === newChat._id)) {
        return [
          ...prevChats,
          { ...newChat, section: newChat.isGroupChat ? "groups" : "home" },
        ];
      }
      return prevChats;
    });
    setSelectedChat(newChat);
  };

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
        onNewChat={handleNewChat}
      />
      {selectedChat && <MessagesPane chat={selectedChat} />}
    </Sheet>
  );
}
