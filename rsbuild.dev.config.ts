import config from "./rsbuild.config.ts";

config.server!.proxy = {
  "/api": {
    target: "http://127.0.0.1:3000"
  },
  "/api/ws": {
    target: "http://127.0.0.1:3000",
    ws: true
  },
  "/assets": {
    target: "http://127.0.0.1:3000"
  }
};

export default config;
