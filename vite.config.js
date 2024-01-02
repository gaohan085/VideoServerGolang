import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  root: "./web_src/",
  base: !isProduction ? "/" : "/dist",
  server: {
    host: "0.0.0.0",
    port: 3333,
    strictPort: true,
  },
  plugins: [react()],
  build: {
    emptyOutDir: true,
    outDir: "../dist",
    assetsDir: ".",
    cssCodeSplit: true,
    cssMinify: true,
    chunkSizeWarningLimit: 100,
    rollupOptions: {
      output: {
        chunkFileNames: "[name]-[hash:10].js",
        manualChunks: {
          react: ["react"],
          "react-dom": ["react-dom"],
          redux: ["redux"],
          plyr: ["plyr"],
          "framer-motion": ["framer-motion"],
          axios: ["axios"],
          swr: ["swr"],
          "react-icons": ["react-icons"],
        },
      },
    },
  },
  preview: {
    port: 3333,
    strictPort: true,
  },
});
