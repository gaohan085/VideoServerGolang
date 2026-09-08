import config from "./rsbuild.config.ts";

const host = "http://192.168.1.31";

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
