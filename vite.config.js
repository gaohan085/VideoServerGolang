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
  css: {
    modules: {
      localsConvention: "camelCase",
      generateScopedName: isProduction
        ? (name) => name
        : (name, filename, css) => {
            let componentName = filename
              .replace(/\.\w+$/, "")
              .replace(".", "-")
              .split("/")
              .pop();
            return `${componentName}-${name}`;
          },
    },
  },
  build: {
    emptyOutDir: true,
    outDir: "../dist",
    assetsDir: ".",
    cssCodeSplit: true,
    cssMinify: true,
    chunkSizeWarningLimit: 100,
    rollupOptions: {
      // external: ["react", "react-dom", "axios", "plyr", "framer-motion"],
      output: {
        chunkFileNames: "[name]-[hash:10].js",
        manualChunks: {
          react: ["react","react-dom"],
          redux: ["redux"],
          plyr: ["plyr"],
          "framer-motion": ["framer-motion"],
          axios: ["axios"],
          swr: ["swr"],
          "react-icons": ["react-icons"],
          "@reduxjs-toolkit": ["@reduxjs/toolkit"],
        },
        // paths: {
        //   react: "https://cdn.jsdelivr.net/npm/react@18.2.0/+esm",
        //   "react-dom": "https://cdn.jsdelivr.net/npm/react-dom@18.2.0/+esm",
        //   axios: "https://cdn.jsdelivr.net/npm/axios@1.6.5/+esm",
        //   plyr: "https://cdn.jsdelivr.net/npm/plyr@3.7.8/+esm",
        //   "framer-motion":
        //     "https://cdn.jsdelivr.net/npm/framer-motion@10.18.0/+esm",
        // },
      },
    },
  },
  preview: {
    port: 3333,
    strictPort: true,
  },
});
