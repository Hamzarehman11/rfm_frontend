"use client";
import { Box } from "@mui/material";
// import Image from "next/image";

import Header from "./components/common/header";
import UploadAndPreview from "./components/upload";

export default function Home() {
  return (
    <div>
      <Header />
      <Box>
        <UploadAndPreview />
      </Box>
    </div>
  );
}
