import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { getConfigUrl } from "./src/redux/api/baseUrl";

export default defineConfig({
  plugins: [react()],
  server: {
    host: getConfigUrl(),
    port: 3007,
  },
});
