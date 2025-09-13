import config from "./rsbuild.config.ts";

const host = "http://192.168.1.199";

config.server!.proxy = {
  "/api": {
    target: host
  },
  "/api/ws": {
    target: host,
    ws: true
  },
  "/assets": {
    target: host,
  }
};

export default config;
