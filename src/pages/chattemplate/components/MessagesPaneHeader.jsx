import * as React from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "@mui/joy/Avatar";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import CircleIcon from "@mui/icons-material/Circle";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import PhoneInTalkRoundedIcon from "@mui/icons-material/PhoneInTalkRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import { toggleMessagesPane } from "../utils";

export default function MessagesPaneHeader({ sender }) {
  const navigate = useNavigate();
  const isSenderAvailable = !!sender;
  const avatarSrc = sender?.avatar || "/default-avatar.png";
  const senderName = sender?.name || "Unknown User";
  const senderEmail = sender?.email || "No email available";
  const isOnline = sender?.online || false;

  const handleViewProfile = () => {
    if (sender?._id) {
      navigate(`/profile/${sender._id}`);
    }
  };

  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        py: { xs: 2, md: 2 },
        px: { xs: 1, md: 2 },
        borderBottom: "1px solid",
        borderColor: "neutral.700",
        backgroundColor: "background.level1", // Match outer chat list
        position: "sticky",
        top: "var(--Header-height)",
        zIndex: 10,
      }}
    >
      <Stack
        direction="row"
        spacing={{ xs: 1, md: 2 }}
        sx={{ alignItems: "center" }}
      >
        <IconButton
          variant="plain"
          color="neutral"
          size="sm"
          sx={{
            display: { xs: "inline-flex", sm: "none" },
            color: "neutral.700",
          }}
          onClick={() => toggleMessagesPane()}
        >
          <ArrowBackIosNewRoundedIcon />
        </IconButton>
        <Avatar size="lg" src={avatarSrc} />
        <div>
          <Typography
            component="h2"
            noWrap
            endDecorator={
              isOnline ? (
                <Chip
                  variant="outlined"
                  size="sm"
                  color="neutral"
                  sx={{ borderRadius: "sm", borderColor: "primary.500" }}
                  startDecorator={
                    <CircleIcon sx={{ fontSize: 8, color: "primary.500" }} />
                  }
                >
                  Online
                </Chip>
              ) : undefined
            }
            sx={{ fontWeight: "lg", fontSize: "lg", color: "text.primary" }}
          >
            {senderName}
          </Typography>
          <Typography level="body-sm" sx={{ color: "text.secondary" }}>
            {senderEmail}
          </Typography>
        </div>
      </Stack>
      <Stack spacing={1} direction="row" sx={{ alignItems: "center" }}>
        <Button
          startDecorator={<PhoneInTalkRoundedIcon />}
          color="neutral"
          variant="outlined"
          size="sm"
          sx={{
            display: { xs: "none", md: "inline-flex" },
            bgcolor: "neutral.700",
            color: "#FFF",
          }}
          disabled={!isSenderAvailable}
        >
          Call
        </Button>
        <Button
          color="neutral"
          variant="outlined"
          size="sm"
          sx={{
            display: { xs: "none", md: "inline-flex" },
            bgcolor: "neutral.700",
            color: "#FFF",
          }}
          disabled={!isSenderAvailable}
          onClick={handleViewProfile}
        >
          View Profile
        </Button>
        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          sx={{ color: "neutral.700" }}
        >
          <MoreVertRoundedIcon />
        </IconButton>
      </Stack>
    </Stack>
  );
}
