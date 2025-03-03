import React, { useState, useEffect } from "react";
import { CssVarsProvider, extendTheme, useColorScheme } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Stack from "@mui/joy/Stack";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import GoogleIcon from "./assets/GoogleIcon";
import { PasswordStrengthMeter } from "../ui/password-input";
import { Link } from "react-router-dom";
import "./signup.css";
function ColorSchemeToggle({ onClick, ...props }) {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <IconButton
      aria-label="toggle light/dark mode"
      size="sm"
      variant="outlined"
      disabled={!mounted}
      onClick={(event) => {
        setMode(mode === "light" ? "dark" : "light");
        onClick?.(event);
      }}
      {...props}
    >
      {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}

const customTheme = extendTheme({ defaultColorScheme: "dark" });

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState(null);
  const [strength, setStrength] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (password) => {
    if (!password) return 0;
    if (password.length < 8) return 1;
    if (password.length < 12) return 2;
    if (password.length < 15) return 3;
    if (
      /\d/.test(password) &&
      /[A-Z]/.test(password) &&
      /[@$!%*?&]/.test(password)
    )
      return 4;
    return 3;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setMessage("Registration successful!");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPic(null);
      setStrength(0);
      window.location.href = "/ChatHome";
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <CssVarsProvider theme={customTheme} disableTransitionOnChange>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Form-maxWidth": "800px",
            "--Transition-duration": "0.4s",
          },
        }}
      />
      <Box
        sx={{
          width: { xs: "100%", md: "50vw" },
          transition: "width var(--Transition-duration)",
          position: "relative",
          zIndex: 1,
          display: "flex",
          justifyContent: "flex-end",
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255 255 255 / 0.2)",
          '&[data-color-scheme="dark"]': {
            backgroundColor: "rgba(19 19 24 / 0.4)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100dvh",
            width: "100%",
            px: 2,
          }}
        >
          <Box
            component="header"
            sx={{ py: 3, display: "flex", justifyContent: "space-between" }}
          >
            <Box sx={{ gap: 2, display: "flex", alignItems: "center" }}>
              <img
                src="https://res.cloudinary.com/dajhuukuw/image/upload/v1740335536/freepik__the-style-is-modern-and-it-is-a-detailed-illustrat__31799_gxrtsn.png"
                alt=""
                srcSet=""
                width="60px"
              />
              <Typography level="title-lg">Vybsync</Typography>
            </Box>
          </Box>

          <Box
            component="main"
            sx={{
              my: "auto",
              py: 2,
              pb: 5,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: 400,
              maxWidth: "100%",
              mx: "auto",
              borderRadius: "sm",
            }}
          >
            {error && (
              <Typography level="body-sm" color="danger">
                {error}
              </Typography>
            )}
            {message && (
              <Typography level="body-sm" color="success">
                {message}
              </Typography>
            )}

            <Stack sx={{ gap: 4, mb: 2 }}>
              <Stack sx={{ gap: 1 }}>
                <Typography component="h1" level="h2">
                  Sign in
                </Typography>
                <Typography level="body-m">
                  Existing user?{" "}
                  <Link
                    to="/login"
                    style={{ color: "blue", textDecoration: "none" }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Stack>
              <Button
                variant="soft"
                color="neutral"
                fullWidth
                startDecorator={<GoogleIcon />}
                onClick={() =>
                  (window.location.href =
                    "http://localhost:8080/api/user/auth/google")
                }
              >
                Continue with Google
              </Button>
            </Stack>

            <Divider>or</Divider>

            <Stack sx={{ gap: 4, mt: 2 }}>
              <form onSubmit={handleSubmit}>
                <FormControl required>
                  <FormLabel>Name</FormLabel>
                  <Input
                    type="text"
                    name="name"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
                <FormControl required>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type={showPassword ? "text" : "password"} // Toggle type
                    name="password"
                    value={password}
                    onChange={(e) => {
                      const newPassword = e.target.value;
                      setPassword(newPassword);
                      setStrength(getPasswordStrength(newPassword));
                    }}
                    endDecorator={
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        size="sm"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    }
                  />
                </FormControl>

                <br />
                <PasswordStrengthMeter value={strength} />
                <FormControl required>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input
                    type="password"
                    name="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </FormControl>
                <Stack sx={{ gap: 4, mt: 2 }}>
                  <Button type="submit" fullWidth>
                    Sign in
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left: { xs: 0, md: "50vw" },
          transition:
            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage:
            "url(https://img.freepik.com/free-vector/messages-concept-illustration_114360-583.jpg?t=st=1740314107~exp=1740317707~hmac=981d1ec2a3634fbef2bfc68072031a99066ee2fd95164eafc5edd10fe9767f54&w=900)",
          '&[data-color-scheme="dark"]': {
            backgroundImage:
              "url(https://images.unsplash.com/photo-1572072393749-3ca9c8ea0831?auto=format&w=1000&dpr=2)",
          },
        }}
      />
    </CssVarsProvider>
  );
}
