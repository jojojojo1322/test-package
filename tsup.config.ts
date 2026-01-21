import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "ui/index": "src/ui/index.ts",
    "api/index": "src/api/index.ts",
    "store/index": "src/store/index.ts",
    "configs/index": "src/configs/index.ts",
  },
  format: ["esm", "cjs"],
  sourcemap: true,
  dts: true,
  clean: true,
  treeshake: true,
  minify: false,
  external: [
    "react",
    "react-dom",
    "@mui/material",
    "@emotion/react",
    "@emotion/styled",
    "axios",
    "zustand",
    "react-toastify",
  ],
});
