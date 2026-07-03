import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5184,      // 👈 choose any port you want
    strictPort: true // 👈 fail if port is already in use
  }
});
