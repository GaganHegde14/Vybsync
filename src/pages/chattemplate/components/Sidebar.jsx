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
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import ModalClose from "@mui/joy/ModalClose";
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
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { closeSidebar } from "../utils";
import { jwtDecode } from "jwt-decode";

function Toggler(props) {
  const { defaultExpanded = false, renderToggle, children } = props;
  const [open, setOpen] = React.useState(defaultExpanded);
  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={[
          {
            display: "grid",
            transition: "0.2s ease",
            "& > *": { overflow: "hidden" },
          },
          open ? { gridTemplateRows: "1fr" } : { gridTemplateRows: "0fr" },
        ]}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}

export default function Sidebar() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    name: "Loading...",
    email: "Loading...",
    pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  });
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [friends, setFriends] = useState([]);

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

    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://vybsync-back-production.up.railway.app/api/chat",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch chats");

        const chats = await response.json();
        const friendList = chats
          .filter((chat) => !chat.isGroupChat)
          .map((chat) =>
            chat.users.find((user) => user._id !== jwtDecode(token).id)
          );
        setFriends(friendList);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };

    fetchUserProfile();
    fetchFriends();
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
    if (!groupName.trim() || selectedUsers.length < 2) {
      console.log("Group name and at least two users required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
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
            users: selectedUsers.map((user) => user._id),
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

      setGroupName("");
      setSelectedUsers([]);
      setOpenGroupModal(false);
      navigate("/home"); // Default to Home for all chats
    } catch (err) {
      console.error("Error creating group:", err.message);
    }
  };

  const handleSelectUser = (user) => {
    if (!selectedUsers.some((u) => u._id === user._id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userId));
  };

  const filteredFriends = friends.filter((friend) =>
    (friend.name.toLowerCase() + friend.email.toLowerCase()).includes(
      searchQuery.toLowerCase()
    )
  );

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
            <Button
              variant="outlined"
              color="neutral"
              fullWidth
              onClick={() => setOpenGroupModal(true)}
            >
              Create Group
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
        <Avatar variant="outlined" size="sm" src={userProfile.pic} />
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

      {/* Group Creation Modal */}
      <Modal open={openGroupModal} onClose={() => setOpenGroupModal(false)}>
        <ModalDialog sx={{ width: "400px", p: 3 }}>
          <ModalClose />
          <Typography level="h4" sx={{ mb: 2 }}>
            Create New Group
          </Typography>
          <Input
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Input
            placeholder="Search friends by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            startDecorator={<SearchRoundedIcon />}
            sx={{ mb: 2 }}
          />
          <Box sx={{ maxHeight: "150px", overflowY: "auto", mb: 2 }}>
            {filteredFriends.map((friend) => (
              <ListItem
                key={friend._id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 0.5,
                }}
              >
                <Typography>
                  {friend.name} ({friend.email})
                </Typography>
                <Button
                  size="sm"
                  variant="outlined"
                  onClick={() => handleSelectUser(friend)}
                  disabled={selectedUsers.some((u) => u._id === friend._id)}
                >
                  Add
                </Button>
              </ListItem>
            ))}
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
            {selectedUsers.map((user) => (
              <Chip
                key={user._id}
                endDecorator={
                  <IconButton
                    size="sm"
                    variant="plain"
                    color="neutral"
                    onClick={() => handleRemoveUser(user._id)}
                  >
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                }
                sx={{ bgcolor: "primary.500", color: "#FFF" }}
              >
                {user.name}
              </Chip>
            ))}
          </Box>
          <Button
            variant="solid"
            fullWidth
            onClick={handleCreateGroup}
            disabled={selectedUsers.length < 2 || !groupName.trim()}
          >
            Create Group
          </Button>
        </ModalDialog>
      </Modal>
    </Sheet>
  );
}
