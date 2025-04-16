import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";

const isProduction = process.env.NODE_ENV === "production";

const config = defineConfig({
  root: "./",
  server: {
    base: !isProduction ? "/" : "/dist/",
    host: "0.0.0.0",
    port: 5173,
    open: false,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://192.168.1.199"
      },
      "/api/ws": {
        target: "http://192.168.1.199",
        ws: true
      },
      "/assets": {
        target: "http://192.168.1.199"
      }
    },
  },

  html: {
    template: "./web_src/index.html",
  },
  source: {
    entry: {
      index: "./web_src/index.ts"
    }
  },
  plugins: [pluginReact(), pluginSass()],
});

if (isProduction) {
  config.output = {
    cleanDistPath: true,
    distPath: {
      root: "./dist",
      html: "./",
      js: "js",
      css: "css",
      font: "assets",
      svg: "assets",
      image: "assets",
    },
    filename: {
      js: "[id].js?v=[contenthash:8]"
    },
    sourceMap: {
      js: "source-map",
      css: true,
    }
  };

  config.performance = {
    removeConsole: true,
    chunkSplit: {
      strategy: "split-by-module",
    }
  };
}

export default config;