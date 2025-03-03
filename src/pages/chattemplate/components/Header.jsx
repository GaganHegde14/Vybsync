import * as React from "react";
import GlobalStyles from "@mui/joy/GlobalStyles";
import IconButton from "@mui/joy/IconButton";
import Sheet from "@mui/joy/Sheet";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { toggleSidebar } from "../utils";

export default function Header() {
  return (
    <Sheet
      sx={{
        display: { sm: "flex", md: "none" },
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        top: 0,
        width: "100vw",
        height: "var(--Header-height)",
        zIndex: 9995,
        p: 2,
        gap: 1,
        borderBottom: "1px solid",
        borderColor: "neutral.700", // Darker border
        bgcolor: "background.level2", // Darker purple
      }}
    >
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--Header-height": "52px",
            [theme.breakpoints.up("lg")]: {
              "--Header-height": "0px",
            },
          },
        })}
      />
      <IconButton
        onClick={() => toggleSidebar()}
        variant="outlined"
        color="neutral"
        size="sm"
        sx={{ color: "neutral.700" }}
      >
        <MenuRoundedIcon />
      </IconButton>
    </Sheet>
  );
}
