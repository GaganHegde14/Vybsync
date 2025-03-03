import React from "react";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ChatHome from "./components/ChatHome";

// Custom theme with light purple and dark colors
const customTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#8B5CF6", // Light purple
          500: "#8B5CF6",
        },
        background: {
          surface: "#F3E8FF", // Very light purple
          level1: "#EDE9FE", // Slightly darker purple
          level2: "#DDD6FE", // Darker still
        },
        text: {
          primary: "#1F2937", // Dark gray for readability
          secondary: "#4B5563",
        },
        neutral: {
          500: "#6B7280", // Medium gray
          700: "#374151", // Darker gray
        },
      },
    },
  },
  components: {
    JoySheet: {
      styleOverrides: {
        root: {
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            boxShadow: "0 4px 20px rgba(139, 92, 246, 0.2)",
          },
        },
      },
    },
    JoyListItemButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#DDD6FE",
            transform: "translateX(5px)",
            transition: "transform 0.2s ease, background-color 0.2s ease",
          },
        },
      },
    },
    JoyButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#7C3AED", // Darker purple on hover
            transform: "scale(1.05)",
            transition: "transform 0.2s ease, background-color 0.2s ease",
          },
        },
      },
    },
  },
});

export default function JoyMessagesTemplate({ section = "home" }) {
  return (
    <CssVarsProvider theme={customTheme} disableTransitionOnChange>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          minHeight: "100dvh",
          bgcolor: "background.surface",
        }}
      >
        <Sidebar />
        <Header />
        <Box
          component="main"
          className="MainContent"
          sx={{ flex: 1, overflowX: "hidden" }}
        >
          <ChatHome section={section} />
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
