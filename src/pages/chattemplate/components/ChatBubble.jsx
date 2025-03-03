import React, { useState } from "react";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Avatar from "@mui/joy/Avatar";
import IconButton from "@mui/joy/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function ChatBubble({
  variant,
  content,
  sender,
  timestamp,
  messageId,
  onDelete,
  currentUserId,
  seen,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    onDelete(messageId);
    handleClose();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: variant === "sent" ? "flex-end" : "flex-start",
        mb: 1,
        px: 2,
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.02)",
        },
        width: "100%", // Full width for alignment
        maxWidth: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: variant === "sent" ? "row-reverse" : "row",
          alignItems: "flex-end",
          width: "100%", // Full width
          maxWidth: "70%",
        }}
      >
        {variant !== "sent" && (
          <Avatar src={sender?.pic} size="lg" sx={{ mx: 1 }} />
        )}
        <Box
          sx={{
            backgroundColor:
              variant === "sent" ? "#EDE9FE" : seen ? "#e4a0f7" : "#e4a0f7", // Correct colors
            color: variant === "sent" ? "#1F2937" : "#FFF",
            borderRadius: "8px",
            p: 1,
            boxShadow: "sm",
            display: "flex",
            alignItems: "center",
            width: "100%", // Ensure full width for alignment
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography level="body-sm">{content}</Typography>
            <Typography level="body-xs" sx={{ opacity: 0.7 }}>
              {timestamp} {variant === "sent" && seen && "(Seen)"}
            </Typography>
          </Box>
          {sender._id === currentUserId && (
            <IconButton
              size="sm"
              sx={{ ml: 1, color: "neutral.700" }}
              onClick={handleClick}
            >
              <MoreVertIcon />
            </IconButton>
          )}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            placement="bottom-end"
          >
            <MenuItem onClick={handleDelete}>Delete for Everyone</MenuItem>
          </Menu>
          {variant === "sent" && seen && (
            <CheckCircleIcon
              sx={{ ml: 1, color: "primary.500", fontSize: "14px" }}
            />
          )}
        </Box>
        {variant === "sent" && (
          <Avatar src={sender?.pic} size="lg" sx={{ mx: 1 }} />
        )}
      </Box>
    </Box>
  );
}
