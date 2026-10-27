import config from "./rsbuild.config.ts";

config.server!.proxy = {
  "/api": "http://192.168.1.31",
  "/api/ws": {
    target: "http://192.168.1.31",
    ws: true
  },
  "/assets": "http://192.168.1.31",
  "/video": "http://192.168.1.31",
};

export default config;
