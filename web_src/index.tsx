import * as Components from "./Components";
import { createRoot } from "react-dom/client";
import { fetcher } from "./lib/fetcher";
import Plyr from "plyr";
import { Provider } from "react-redux";
import store from "./lib/reduxStore";
import { SWRConfig } from "swr";
import React, { StrictMode } from "react";

const app = document.getElementById("app");

createRoot(app).render(
  <StrictMode>
    <SWRConfig
      value={{
        refreshInterval: 50000,
        fetcher: fetcher,
        revalidateOnFocus: true,
      }}>
      <Provider store={store}>
        <Components.SideBar />
      </Provider>
    </SWRConfig>
  </StrictMode>
);

const statusbar = document.getElementById("statusbar");
createRoot(statusbar).render(
  <StrictMode>
    <SWRConfig
      value={{
        refreshInterval: 50000,
        fetcher: fetcher,
        revalidateOnFocus: true,
      }}>
      <Provider store={store}>
        <Components.StatusBar />
      </Provider>
    </SWRConfig>
  </StrictMode>
);

let src: string = "aaaa";
const render = () => {
  src = store.getState().redux.playSource;
  // console.log(src);
  // console.log(plyr.source.sources[0].src);
};

const videoNode = document.getElementById("plyr");
const plyr = new Plyr(videoNode, {
  enabled: true,
  debug: true,
  autoplay: true,
  clickToPlay: true,
  controls: [
    "play-large",
    "play",
    "fast-forward",
    "progress",
    "current-time",
    "duration",
    "mute",
    "volume",
    "captions",
    "settings",
    "fullscreen",
  ],
  ratio: "16:9",
  seekTime: 3,
  blankVideo: "",
  keyboard: { focused: false, global: true },
});

plyr.source = {
  type: "video",
  sources: [
    {
      src: src,
    },
  ],
};

plyr.on("ready", (e) => {
  console.log(e.detail.plyr);
  render();
  store.subscribe(render);
});
