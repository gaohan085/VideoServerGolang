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
    js: "[name].js?v=[contenthash:8]"
  },
  sourceMap: {
    js: "source-map",
    css: true,
  },
  cssModules: {
    localIdentName: "[local]"
  }
};

export default config;