import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/hkmap": {
        target: "https://mapapi.geodata.gov.hk",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/hkmap/, ""),
      },
    },
  },
});
