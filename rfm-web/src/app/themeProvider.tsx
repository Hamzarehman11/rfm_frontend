"use client";
import * as React from "react";
import { useEffect, useCallback, useMemo } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

type Mode = "light" | "dark";
export const ThemeModeContext = React.createContext<{
  mode: Mode;
  toggle: () => void;
}>({
  mode: "light",
  toggle: () => {},
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<Mode>("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Mode | null;
    const initial =
      saved ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setMode(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggle = useCallback(() => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                background: { default: "#fff", paper: "#f8f8f8" },
                text: { primary: "#171717" },
                border: { main: "rgba(0,0,0,0.1)" },
                accent: { main: "#1976d2" },
                header: { main: "#0a0a0a", contrastText: "#ffffff" },
              }
            : {
                background: { default: "#0a0a0a", paper: "#171717" },
                text: { primary: "#ededed" },
                border: { main: "rgba(255,255,255,0.1)" },
                accent: { main: "#90caf9" },
                header: { main: "#ffffff", contrastText: "#0a0a0a" },
              }),
        },
        typography: { fontFamily: "Arial, Helvetica, sans-serif" },
      }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}
