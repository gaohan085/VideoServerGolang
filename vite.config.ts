import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

const isProduction = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [tanstackRouter({
    target: "react",
    autoCodeSplitting: true,
    routesDirectory: "./routes",
    generatedRouteTree: "./routeTree.gen.ts",
    routeFileIgnorePrefix: "-",
    quoteStyle:"double",
  }),react()],
  root: "web_src",
  base: !isProduction ? "/" : "/dist",
  input: "index.tsx",
  clearScreen: false,
  assetsInclude: ['**/*.svg'],

  server: {
    port: 5173,
    strictPort: true,
    hmr: true,
    origin: "http://localhost:5173",
  },

  build: {
    manifest: true,
    outDir: "./dist",
    assetsDir: "assets",
    sourcemap: true,
    rolldownOptions: {
      output: {
        assetFileNames: (chunkinfo) => {
          return chunkinfo.names[0]?.includes(".css") ? "css/[hash:10][extname]" :"[hash:10][extname]";
        },
        chunkFileNames: "js/[hash:10].js",
        entryFileNames:"js/[hash:10].js",
        hashCharacters: "hex",
        cleanDir: true,
      },
      checks: {
        moduleLevelDirective: false
      }
    }
  }
});
