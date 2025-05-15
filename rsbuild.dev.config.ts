import config from "./rsbuild.config.ts";

config.server!.proxy = {
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
};

export default config;
