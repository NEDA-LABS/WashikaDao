import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
      react(),
      tailwindcss(),
  ],
  server: {
    allowedHosts: ["all"],
  },
    define: {
      'process.env.VITE_THIRDWEB_CLIENT_ID': JSON.stringify(process.env.VITE_THIRDWEB_CLIENT_ID)
    },
  ssr: {
    noExternal: ["react-router"]
  }
});
