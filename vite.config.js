import react from "@vitejs/plugin-react"
import { cwd } from "process"

const isProduction = process.env.NODE_ENV === "production";

/** @type {import("vite").UserConfig} */
const config = {
  root: "./web_src/",
  base: !isProduction ? "/" : "/dist/",
  build: {
    emptyOutDir: true,
    outDir: "../dist",
    assetsDir: ".",
    cssCodeSplit: true,
    cssMinify: true,
    chunkSizeWarningLimit: 244,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.names[0].includes(".css")) {
            return "css/[hash:10][extname]"
          }
          return "assets/[hash:10][extname]"
        },
        chunkFileNames: "js/[name]-[hash:10].js",
        manualChunks: {
          react: ["react"],
          "react-dom": ["react-dom"],
          redux: ["redux"],
          plyr: ["plyr"],
          axios: ["axios"],
          swr: ["swr"],
          "react-icons": ["react-icons"],
          "react-router": ["react-router"],
          "react-router-dom": ["react-router-dom"],
          "react-transition-group": ["react-transition-group"]
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    open: false,
    strictPort: true
  },

  plugins: [
    react()
  ],

}

if (isProduction) {
  config.esbuild = {
    drop: ["console", "debugger"]
  }
}

export default config