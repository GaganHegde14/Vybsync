import React from "react";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import { useParams } from "react-router-dom";
import Sidebar from "../chattemplate/components/Sidebar";
import Header from "./components/Header";
import MyProfile from "./components/MyProfile";

const customTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#8B5CF6",
          500: "#8B5CF6",
        },
        background: {
          surface: "#F3E8FF",
          level1: "#EDE9FE",
          level2: "#DDD6FE",
        },
        text: {
          primary: "#1F2937",
          secondary: "#4B5563",
        },
        neutral: {
          500: "#6B7280",
          700: "#374151",
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
    JoyButton: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#7C3AED",
            transform: "scale(1.05)",
            transition: "transform 0.2s ease, background-color 0.2s ease",
          },
        },
      },
    },
  },
});

export default function JoyOrderDashboardTemplate() {
  const { userId } = useParams(); // Get userId from route params

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
          sx={{
            pt: { xs: "calc(12px + var(--Header-height))", md: 3 },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100dvh",
            gap: 1,
            overflowX: "hidden",
          }}
        >
          <MyProfile userId={userId} />
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
