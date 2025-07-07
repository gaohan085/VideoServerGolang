import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";
import { TanStackRouterRspack } from "@tanstack/router-plugin/rspack";

const isProduction = process.env.NODE_ENV === "production";

const config = defineConfig({
  root: "./",
  server: {
    base: !isProduction ? "/" : "/dist/",
    host: "0.0.0.0",
    port: 5173,
    open: false,
    strictPort: true,
  },

  html: {
    template: "./web_src/index.html",
  },
  source: {
    entry: {
      index: "./web_src/index.tsx"
    }
  },
  plugins: [pluginReact(
    {
      swcReactOptions: {
        refresh: true,
        runtime: "automatic"
      }
    }
  ), pluginSass()],

  tools: {
    rspack: {
      plugins: [TanStackRouterRspack({
        target: "react",
        autoCodeSplitting: true,
        routesDirectory: "./web_src/routes",
        generatedRouteTree: "./web_src/routeTree.gen.ts"
      })]
    }
  },

  output: {
    injectStyles: !isProduction,
    cssModules: {
      localIdentName: "[path][name]__[local]-[hash:base64:6]"
    }
  }
});

export default config;