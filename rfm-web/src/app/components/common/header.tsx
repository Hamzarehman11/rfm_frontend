"use client";
import * as React from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  Theme,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ThemeModeContext } from "@/app/themeProvider";

export default function Header() {
  const { mode, toggle } = React.useContext(ThemeModeContext);
  const theme: Theme = useTheme();

  console.log(theme);

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        marginTop: "10px",
      }}
    >
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{
          width: "97.5%",
          bgcolor: theme.palette.header.main,
          color: theme.palette.header.contrastText,
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          borderRadius: "5px",
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            RFM Studio
          </Typography>
          <IconButton
            color="inherit"
            onClick={toggle}
            aria-label="toggle theme"
          >
            {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
