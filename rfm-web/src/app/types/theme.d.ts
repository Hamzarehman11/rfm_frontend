import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    header: Palette["primary"];
    border: Palette["primary"];
    accent: Palette["primary"];
  }

  interface PaletteOptions {
    header?: PaletteOptions["primary"];
    border?: PaletteOptions["primary"];
    accent?: PaletteOptions["primary"];
  }
}
