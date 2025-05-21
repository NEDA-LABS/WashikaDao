import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["all"],
  },
    define: {
      'process.env.VITE_THIRDWEB_CLIENT_ID': JSON.stringify(process.env.VITE_THIRDWEB_CLIENT_ID)
    }
});
