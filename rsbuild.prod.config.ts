import config from "./rsbuild.config.ts";

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
    js: "[contenthash:8].js?v=[contenthash:8]"
  },
  sourceMap: {
    js: "source-map",
    css: true,
  },
  cssModules: {
    localIdentName: "[local]"
  }
};

config.performance = {
  removeConsole: true,
  chunkSplit: {
    strategy: "split-by-module",
  }
};

export default config;