import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlobalStyles from "@mui/joy/GlobalStyles";
import Avatar from "@mui/joy/Avatar";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import CallIcon from "@mui/icons-material/Call";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import MissedVideoCallIcon from "@mui/icons-material/MissedVideoCall";
import CallMissedIcon from "@mui/icons-material/CallMissed";
import LinearProgress from "@mui/joy/LinearProgress";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton, { listItemButtonClasses } from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import Stack from "@mui/joy/Stack";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import QuestionAnswerRoundedIcon from "@mui/icons-material/QuestionAnswerRounded";
import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import SupportRoundedIcon from "@mui/icons-material/SupportRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import BrightnessAutoRoundedIcon from "@mui/icons-material/BrightnessAutoRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { closeSidebar } from "../utils";
import { jwtDecode } from "jwt-decode";
import { socket } from "../socket"; // Ensure socket import

export default function Sidebar() {
  const navigate = useNavigate();
  const [groupEmails, setGroupEmails] = useState("");
  const [groupName, setGroupName] = useState("");
  const [userProfile, setUserProfile] = useState({
    name: "Loading...",
    email: "Loading...",
    pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const response = await fetch(
          `https://vybsync-back-production.up.railway.app/api/user/${decoded.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setUserProfile({
          name: data.name,
          email: data.email,
          pic: data.pic || userProfile.pic,
        });
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeSidebar();
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || !groupEmails.trim()) {
      console.log("Group name and at least one email required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const emailList = groupEmails.split(",").map((email) => email.trim());

      const userPromises = emailList.map((email) =>
        fetch(
          `https://vybsync-back-production.up.railway.app/api/user?search=${encodeURIComponent(
            email
          )}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ).then((res) => {
          if (!res.ok) throw new Error(`Failed to fetch user: ${email}`);
          return res.json();
        })
      );

      const userResponses = await Promise.all(userPromises);
      const userIds = userResponses
        .flat()
        .filter((user) => user && emailList.includes(user.email))
        .map((user) => user._id);

      if (userIds.length < 2) {
        console.log("At least two valid users required");
        return;
      }

      const response = await fetch(
        "https://vybsync-back-production.up.railway.app/api/chat/group",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: groupName,
            users: userIds,
            isGroupChat: true,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create group");
      }

      const newGroup = await response.json();
      console.log("Group created:", newGroup);

      // Emit event to update chats
      socket.emit("newGroupCreated", newGroup);

      setGroupName("");
      setGroupEmails("");
      navigate("/groups");
    } catch (err) {
      console.error("Error creating group:", err.message);
    }
  };

  const handleGroupCalls = () => {
    console.log("Group Calls clicked - To be implemented");
  };

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: "fixed", md: "sticky" },
        transform: {
          xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))",
          md: "none",
        },
        transition: "transform 0.4s, width 0.4s",
        zIndex: 10000,
        height: "100dvh",
        width: "var(--Sidebar-width)",
        top: 0,
        p: 2,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Sidebar-width": "220px",
            [theme.breakpoints.up("lg")]: {
              "--Sidebar-width": "240px",
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: "var(--SideNavigation-slideIn)",
          backgroundColor: "var(--joy-palette-background-backdrop)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <center>
          <img
            src="https://res.cloudinary.com/dajhuukuw/image/upload/v1740335536/freepik__the-style-is-modern-and-it-is-a-detailed-illustrat__31799_gxrtsn.png"
            alt="Vybsync"
            width="80px"
          />
        </center>
      </Box>
      <Box
        sx={{
          minHeight: 0,
          overflow: "hidden auto",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: 1,
            "--List-nestedInsetStart": "30px",
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
          }}
        >
          <ListItem>
            <ListItemButton onClick={() => handleNavigation("/home")} selected>
              <HomeRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Home</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => handleNavigation("/work")}>
              <QuestionAnswerRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Work</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => handleNavigation("/groups")}>
              <GroupRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Groups</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => handleNavigation("/unread")}>
              <AssignmentRoundedIcon />
              <ListItemContent>
                <Typography level="title-sm">Unread Messages</Typography>
              </ListItemContent>
            </ListItemButton>
          </ListItem>
          <ListItem nested>
            <Toggler
              renderToggle={({ open, setOpen }) => (
                <ListItemButton onClick={() => setOpen(!open)}>
                  <CallIcon />
                  <ListItemContent>
                    <Typography level="title-sm">Calls</Typography>
                  </ListItemContent>
                  <KeyboardArrowDownIcon
                    sx={[
                      open
                        ? { transform: "rotate(180deg)" }
                        : { transform: "none" },
                    ]}
                  />
                </ListItemButton>
              )}
            >
              <List sx={{ gap: 0.5 }}>
                <ListItem sx={{ mt: 0.5 }}>
                  <CallIcon />
                  <ListItemButton>All calls</ListItemButton>
                </ListItem>
                <ListItem>
                  <CallMissedIcon />
                  <ListItemButton>Missed</ListItemButton>
                </ListItem>
                <ListItem>
                  <MissedVideoCallIcon />
                  <ListItemButton>Video calls</ListItemButton>
                </ListItem>
                <ListItem>
                  <AddIcCallIcon />
                  <ListItemButton>Audio calls</ListItemButton>
                </ListItem>
              </List>
            </Toggler>
          </ListItem>
          <ListItem>
            <Input
              size="sm"
              placeholder="Group Name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              sx={{ mb: 1 }}
            />
          </ListItem>
          <ListItem>
            <Input
              size="sm"
              placeholder="Enter emails (comma-separated)"
              value={groupEmails}
              onChange={(e) => setGroupEmails(e.target.value)}
              endDecorator={
                <Button size="sm" variant="solid" onClick={handleCreateGroup}>
                  Create Group
                </Button>
              }
            />
          </ListItem>
          <ListItem>
            <Button
              variant="outlined"
              color="neutral"
              fullWidth
              onClick={handleGroupCalls}
            >
              Group Calls
            </Button>
          </ListItem>
        </List>

        <List
          size="sm"
          sx={{
            mt: "auto",
            flexGrow: 0,
            "--ListItem-radius": (theme) => theme.vars.radius.sm,
            "--List-gap": "8px",
            mb: 2,
          }}
        >
          <ListItem>
            <ListItemButton>
              <SupportRoundedIcon />
              Support
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Avatar variant="outlined" size="lg" src={userProfile.pic} />
        <Box
          sx={{ minWidth: 0, flex: 1, cursor: "pointer" }}
          onClick={() => handleNavigation("/Myprofile")}
        >
          <Typography level="title-sm">{userProfile.name}</Typography>
          <Typography level="body-xs">{userProfile.email}</Typography>
        </Box>
        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          onClick={() => handleNavigation("/Myprofile")}
          sx={{ mr: 1 }}
        >
          <SettingsRoundedIcon />
        </IconButton>
        <IconButton
          size="sm"
          variant="plain"
          color="neutral"
          onClick={handleLogout}
        >
          <LogoutRoundedIcon />
        </IconButton>
      </Box>
    </Sheet>
  );
}
