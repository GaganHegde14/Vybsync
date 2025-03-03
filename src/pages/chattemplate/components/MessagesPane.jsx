import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import ChatBubble from "./ChatBubble";
import MessageInput from "./MessageInput";
import MessagesPaneHeader from "./MessagesPaneHeader";
import { socket } from "../socket";
import { jwtDecode } from "jwt-decode";

export default function MessagesPane({ chat }) {
  const [chatMessages, setChatMessages] = useState([]);
  const [textAreaValue, setTextAreaValue] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      console.log("Frontend Token:", token);
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.id);
      console.log("Frontend User ID:", decoded.id);
    }
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !chat?._id) {
        console.log("No token or chat ID, skipping fetch");
        return;
      }

      const response = await fetch(
        `http://localhost:8080/api/message/${chat._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch messages");
      }

      const data = await response.json();
      console.log("Fetched messages:", data);
      setChatMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setChatMessages([]);
    }
  };

  useEffect(() => {
    if (chat) {
      fetchMessages();
      socket.emit("joinChat", chat._id);
      console.log("Joined chat room:", chat._id);
    }

    socket.on("messageReceived", (message) => {
      console.log("Received message via Socket.IO:", message);
      if (
        message.chat._id === chat._id &&
        message.sender._id !== currentUserId
      ) {
        setChatMessages((prev) => [...prev, message]);
      }
    });

    socket.on("messageDeleted", ({ messageId }) => {
      console.log("Message deleted via Socket.IO:", messageId);
      setChatMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    });

    socket.on("messageSeen", ({ messageId }) => {
      console.log("Message marked as seen:", messageId);
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, seen: true } : msg
        )
      );
    });

    socket.on("userTyping", ({ userId, chatId }) => {
      if (chatId === chat._id && userId !== currentUserId) {
        setTypingUsers((prev) => [...new Set([...prev, userId])]);
      }
    });

    socket.on("userStoppedTyping", ({ userId, chatId }) => {
      if (chatId === chat._id) {
        setTypingUsers((prev) => prev.filter((id) => id !== userId));
      }
    });

    return () => {
      socket.off("messageReceived");
      socket.off("messageDeleted");
      socket.off("messageSeen");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [chat, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendMessage = async () => {
    if (!textAreaValue.trim() || !chat) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: textAreaValue,
          chatId: chat._id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send message");
      }

      const newMessage = await response.json();
      console.log("Sent message response:", newMessage);
      setChatMessages((prev) => [...prev, newMessage]);
      setTextAreaValue("");

      socket.emit("stopTyping", { userId: currentUserId, chatId: chat._id });
    } catch (error) {
      console.error("Error sending message:", error);
      fetchMessages();
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const token = localStorage.getItem("token");
      console.log("Deleting message:", messageId, "by user:", currentUserId);
      const response = await fetch(
        `http://localhost:8080/api/message/${messageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete message");
      }

      setChatMessages((prev) => prev.filter((msg) => msg._id !== messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleTyping = () => {
    if (!chat) return;

    socket.emit("typing", { userId: currentUserId, chatId: chat._id });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { userId: currentUserId, chatId: chat._id });
    }, 2000);
  };

  return (
    <Sheet
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        bgcolor: "background.level1",
        transition: "transform 0.3s ease-in-out",
        overflowX: "hidden",
      }}
    >
      <MessagesPaneHeader
        sender={chat?.users.find((user) => user._id !== currentUserId)}
      />
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          bgcolor: "background.level2",
          position: "relative",
        }}
      >
        {chatMessages.length > 0 ? (
          chatMessages.map((message, index) => (
            <ChatBubble
              key={message._id}
              variant={
                message.sender._id === currentUserId ? "sent" : "received"
              }
              content={message.content}
              sender={message.sender}
              timestamp={new Date(message.createdAt).toLocaleTimeString()}
              messageId={message._id}
              onDelete={deleteMessage}
              currentUserId={currentUserId}
              seen={message.seen}
            />
          ))
        ) : (
          <Typography
            sx={{ textAlign: "center", py: 2, color: "text.secondary" }}
          >
            No messages yet
          </Typography>
        )}
        <div ref={messagesEndRef} />
      </Box>
      {typingUsers.length > 0 && (
        <Typography
          sx={{
            textAlign: "center",
            py: 1,
            color: "neutral.700",
            bgcolor: "background.level1",
            position: "sticky",
            bottom: 50,
            zIndex: 10,
          }}
        >
          {typingUsers.length === 1
            ? "Someone is typing..."
            : "Multiple users are typing..."}
        </Typography>
      )}
      <MessageInput
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        onSubmit={sendMessage}
        onTyping={handleTyping}
      />
    </Sheet>
  );
}
