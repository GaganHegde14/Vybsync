import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import Avatar from "@mui/joy/Avatar";
import Divider from "@mui/joy/Divider";
import { jwtDecode } from "jwt-decode";

export default function MyProfile({ userId }) {
  // Optional userId for viewing others
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    pic: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode(token);
        const idToFetch = userId || decoded.id; // Use provided userId or current user's ID

        const response = await fetch(
          `http://localhost:8080/api/user/${idToFetch}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setProfile({
          name: data.name,
          email: data.email,
          bio: data.bio || "No bio provided",
          pic: data.pic || profile.pic,
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: profile.name,
          email: profile.email,
          bio: profile.bio,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  const handleChange = (field) => (e) => {
    setProfile({ ...profile, [field]: e.target.value });
  };

  return (
    <Box
      sx={{
        flex: 1,
        width: "100%",
        maxWidth: "800px",
        mx: "auto",
        px: { xs: 2, md: 6 },
        py: { xs: 2, md: 3 },
      }}
    >
      <Typography
        level="h2"
        component="h1"
        sx={{ mb: 2, color: "text.primary" }}
      >
        {userId ? `${profile.name}'s Profile` : "My Profile"}
      </Typography>
      <Card sx={{ bgcolor: "background.level1" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={3}
          sx={{ my: 1 }}
        >
          <Stack direction="column" spacing={1}>
            <Avatar
              size="lg"
              src={profile.pic}
              sx={{ width: 120, height: 120, borderRadius: "50%" }}
            />
            {isEditing && !userId && (
              <Button
                size="sm"
                variant="outlined"
                color="neutral"
                sx={{ mt: 1 }}
                onClick={() =>
                  console.log("Upload new picture - To be implemented")
                }
              >
                Change Picture
              </Button>
            )}
          </Stack>
          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <FormControl>
              <FormLabel sx={{ color: "text.primary" }}>Name</FormLabel>
              {isEditing && !userId ? (
                <Input
                  size="sm"
                  value={profile.name}
                  onChange={handleChange("name")}
                />
              ) : (
                <Typography sx={{ color: "text.secondary" }}>
                  {profile.name}
                </Typography>
              )}
            </FormControl>
            <FormControl>
              <FormLabel sx={{ color: "text.primary" }}>Email</FormLabel>
              {isEditing && !userId ? (
                <Input
                  size="sm"
                  value={profile.email}
                  onChange={handleChange("email")}
                />
              ) : (
                <Typography sx={{ color: "text.secondary" }}>
                  {profile.email}
                </Typography>
              )}
            </FormControl>
            <FormControl>
              <FormLabel sx={{ color: "text.primary" }}>Bio</FormLabel>
              {isEditing && !userId ? (
                <Input
                  size="sm"
                  value={profile.bio}
                  onChange={handleChange("bio")}
                />
              ) : (
                <Typography sx={{ color: "text.secondary" }}>
                  {profile.bio}
                </Typography>
              )}
            </FormControl>
          </Stack>
        </Stack>
        <Divider sx={{ bgcolor: "neutral.700" }} />
        {!userId && (
          <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="outlined"
                  color="neutral"
                  onClick={handleEditToggle}
                >
                  Cancel
                </Button>
                <Button size="sm" variant="solid" onClick={handleSave}>
                  Save
                </Button>
              </>
            ) : (
              <Button size="sm" variant="solid" onClick={handleEditToggle}>
                Edit Profile
              </Button>
            )}
          </CardActions>
        )}
      </Card>
    </Box>
  );
}
