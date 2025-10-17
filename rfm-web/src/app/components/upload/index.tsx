// components/UploadAndPreview.tsx
"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, useTheme, Alert } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Papa from "papaparse";
import * as XLSX from "xlsx";

type Row = Record<string, any>;

export default function UploadAndPreview() {
  const theme = useTheme();
  const [rows, setRows] = React.useState<Row[]>([]);
  const [cols, setCols] = React.useState<GridColDef[]>([]);
  const [fileName, setFileName] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);

  function toTitle(key: string) {
    return key
      .replace(/[_-]+/g, " ")
      .replace(/\s+/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase());
  }

  const hydrateGrid = (data: Row[]) => {
    const preview = data.slice(0, 5000); // limit for big files
    setRows(preview.map((r, i) => ({ id: i + 1, ...r })));
    const first = preview[0] || {};
    const columns: GridColDef[] = Object.keys(first).map((k) => ({
      field: k,
      headerName: toTitle(k),
      flex: 1,
      minWidth: 120,
    }));
    setCols(columns);
  };

  const parseCsv = (file: File) => {
    Papa.parse<Row>(file, {
      header: true,
      skipEmptyLines: true,
      worker: true,
      complete: (res: any) => {
        setError(null);
        hydrateGrid(res.data || []);
      },
      error: (err: any) => setError(`CSV parse error: ${err.message}`),
    });
  };

  const parseExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<Row>(ws, { defval: "" });
        setError(null);
        hydrateGrid(json);
      } catch (e: any) {
        setError(`Excel parse error: ${e?.message || e}`);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const onDrop = React.useCallback((accepted: File[]) => {
    const file = accepted[0];
    if (!file) return;
    setFileName(file.name);

    const ext = file.name.toLowerCase().split(".").pop();
    if (ext === "csv") parseCsv(file);
    else if (ext === "xlsx" || ext === "xls") parseExcel(file);
    else setError("Please upload a CSV or Excel file.");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
    maxFiles: 1,
  });

  return (
    <Box sx={{ p: 3, display: "grid", gap: 2 }}>
      <Box
        {...getRootProps()}
        sx={{
          p: 4,
          textAlign: "center",
          border: `2px dashed ${
            (theme.palette as any).border?.main ||
            (theme.palette.mode === "light"
              ? "rgba(0,0,0,0.2)"
              : "rgba(255,255,255,0.2)")
          }`,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          cursor: "pointer",
          outline: "none",
        }}
      >
        <input {...getInputProps()} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          {isDragActive ? "Drop the file here…" : "Drag & drop CSV/Excel here"}
        </Typography>
        <Typography variant="body2">or click to choose a file</Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {rows.length > 0 && (
        <>
          <Box>
            <Typography variant="subtitle2" sx={{ mt: 5 }}>
              Preview: {fileName} · {rows.length} rows
            </Typography>
          </Box>
          <Box
            sx={{
              height: "60vh",
              maxWidth: "100%",
              overflowX: "auto",
              minWidth: "100%",
            }}
          >
            <DataGrid
              rows={rows}
              columns={cols}
              density="compact"
              disableRowSelectionOnClick
              pageSizeOptions={[25, 50, 100]}
              initialState={{
                pagination: { paginationModel: { pageSize: 25 } },
              }}
            />
          </Box>
        </>
      )}
    </Box>
  );
}
