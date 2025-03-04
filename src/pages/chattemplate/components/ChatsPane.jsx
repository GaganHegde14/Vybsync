import * as React from "react";
import { useState, useEffect } from "react";
import Stack from "@mui/joy/Stack";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import { Box, Chip, IconButton, Input, Button } from "@mui/joy";
import List from "@mui/joy/List";
import Divider from "@mui/joy/Divider";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ChatListItem from "./ChatListItem";
import { toggleMessagesPane } from "../utils";
import { jwtDecode } from "jwt-decode";

export default function ChatsPane({
  chats,
  setChats,
  setSelectedChat,
  selectedChatId,
  onNewChat,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [emailInput, setEmailInput] = useState("");
  const [friendAdded, setFriendAdded] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setCurrentUserId(decoded.id);
    }
  }, []);

  useEffect(() => {
    console.log("Chats in ChatsPane:", chats);
    if (chats.length > 0) {
      setLoading(false);
    }
  }, [chats]);

  const handleAddFriend = async () => {
    if (!emailInput.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const searchResponse = await fetch(
        `https://vybsync-back-production.up.railway.app/api/user?search=${encodeURIComponent(
          emailInput
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!searchResponse.ok) throw new Error("Failed to find user");
      const users = await searchResponse.json();
      const targetUser = users.find((user) => user.email === emailInput);

      if (!targetUser) {
        setFriendAdded({ error: "User not found" });
        return;
      }

      if (targetUser._id === currentUserId) {
        setFriendAdded({ error: "You cannot add yourself" });
        return;
      }

      if (
        chats.some((chat) => chat.users.some((u) => u._id === targetUser._id))
      ) {
        setFriendAdded({ error: "Chat already exists" });
        return;
      }

      const chatResponse = await fetch(
        "https://vybsync-back-production.up.railway.app/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: targetUser._id }),
        }
      );
      if (!chatResponse.ok) throw new Error("Failed to start chat");
      const newChat = await chatResponse.json();
      onNewChat(newChat);
      setEmailInput("");
      setFriendAdded({ success: `Started chat with ${targetUser.name}` });
    } catch (err) {
      console.error("Error adding friend:", err);
      setFriendAdded({ error: err.message });
    }
  };

  return (
    <Sheet
      sx={{
        borderRight: "1px solid",
        borderColor: "neutral.700",
        height: { sm: "calc(100dvh - var(--Header-height))", md: "100dvh" },
        overflowY: "auto",
        overflowX: "hidden",
        bgcolor: "background.level1",
        transition: "transform 0.3s ease-in-out",
      }}
      data-chats-pane
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          pb: 1.5,
          bgcolor: "background.level2",
        }}
      >
        <Typography
          component="h1"
          endDecorator={
            <Chip
              variant="solid"
              color="primary"
              size="md"
              sx={{ bgcolor: "primary.500" }}
            >
              {chats.length}
            </Chip>
          }
          sx={{
            fontSize: { xs: "md", md: "lg" },
            fontWeight: "lg",
            mr: "auto",
            color: "text.primary",
          }}
        >
          Messages
        </Typography>
        <IconButton
          variant="plain"
          aria-label="edit"
          color="neutral"
          size="sm"
          sx={{ display: { xs: "none", sm: "unset" }, color: "neutral.700" }}
        >
          <EditNoteRoundedIcon />
        </IconButton>
        <IconButton
          variant="plain"
          aria-label="edit"
          color="neutral"
          size="sm"
          onClick={() => toggleMessagesPane()}
          sx={{ display: { sm: "none" }, color: "neutral.700" }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Stack>
      <br />
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Input
          size="sm"
          startDecorator={<SearchRoundedIcon sx={{ color: "neutral.700" }} />}
          placeholder="Enter email to add friend"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          endDecorator={
            <Button
              size="sm"
              variant="solid"
              sx={{ bgcolor: "primary.500" }}
              startDecorator={<PersonAddIcon />}
              onClick={handleAddFriend}
            >
              Add
            </Button>
          }
          sx={{ bgcolor: "background.level2" }}
        />
        {friendAdded && (
          <Typography
            sx={{ mt: 1, color: friendAdded.error ? "red" : "primary.500" }}
          >
            {friendAdded.error || friendAdded.success}
          </Typography>
        )}
      </Box>
      {loading ? (
        <Typography
          sx={{ textAlign: "center", py: 2, color: "text.secondary" }}
        >
          Loading...
        </Typography>
      ) : error ? (
        <Typography sx={{ textAlign: "center", py: 2, color: "red" }}>
          Error: {error}
        </Typography>
      ) : chats.length > 0 ? (
        <List
          sx={{
            py: 0,
            "--ListItem-paddingY": "0.75rem",
            "--ListItem-paddingX": "1rem",
            overflowX: "hidden",
          }}
        >
          {chats.map((chat, index) => (
            <React.Fragment key={chat._id}>
              {index > 0 && <Divider sx={{ mx: 2 }} />}
              <ChatListItem
                id={chat._id}
                sender={{
                  name: chat.isGroupChat
                    ? chat.chatName
                    : chat.users.find((user) => user._id !== currentUserId)
                        ?.name || "Unknown",
                  avatar:
                    chat.users.find((user) => user._id !== currentUserId)
                      ?.pic || "",
                  online: false,
                  username:
                    chat.users
                      .find((user) => user._id !== currentUserId)
                      ?.email?.split("@")[0] || "",
                }}
                messages={chat.latestMessage ? [chat.latestMessage] : []}
                setSelectedChat={setSelectedChat}
                selectedChatId={selectedChatId}
                chat={chat}
              />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography
          sx={{ textAlign: "center", py: 2, color: "text.secondary" }}
        >
          No chats available
        </Typography>
      )}
    </Sheet>
  );
}
