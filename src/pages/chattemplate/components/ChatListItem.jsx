import React from "react";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Typography from "@mui/joy/Typography";
import AvatarWithStatus from "./AvatarWithStatus";

export default function ChatListItem(props) {
  const { id, sender, messages, selectedChatId, setSelectedChat, chat } = props;
  const selected = selectedChatId === id;

  const handleChatClick = () => {
    setSelectedChat(chat);
  };

  const latestMessage =
    messages.length > 0 ? messages[0].content : "No messages yet";

  return (
    <ListItem>
      <ListItemButton
        onClick={handleChatClick}
        selected={selected}
        color={selected ? "primary" : undefined}
        sx={{
          flexDirection: "column",
          alignItems: "initial",
          gap: 1,
          px: 2,
          py: 1,
        }}
      >
        <ListItemDecorator>
          <AvatarWithStatus online={sender.online} src={sender.avatar} />
        </ListItemDecorator>
        <ListItemContent>
          <Typography level="title-sm">{sender.name}</Typography>
          <Typography level="body-xs" noWrap sx={{ color: "text.secondary" }}>
            {latestMessage}
          </Typography>
        </ListItemContent>
      </ListItemButton>
    </ListItem>
  );
}
