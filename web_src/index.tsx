import * as Components from "./Components";
import { createRoot } from "react-dom/client";
import { fetcher } from "./lib/fetcher";
import Plyr from "plyr";
import { Provider } from "react-redux";
import store from "./lib/reduxStore";
import { SWRConfig } from "swr";
import type { Unsubscribe } from "redux";
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

const videoNode = document.getElementById("plyr");
const plyr = new Plyr(videoNode, {
  autoplay: true,
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

let unSubscriber: Unsubscribe = null;

plyr.once("ready", (e) => {
  const player = e.detail.plyr;
  unSubscriber = store.subscribe(() => {
    const reduxPlaySrc = store.getState().redux.playSource;
    player.source = {
      type: "video",
      sources: [
        {
          src: reduxPlaySrc,
        },
      ],
    };
  });
});

plyr.on("playing", (e) => {
  const player = e.detail.plyr;
  unSubscriber();
  store.subscribe(() => {
    const reduxPlaySrc = store.getState().redux.playSource;
    const currPlaySrc = player.source as unknown as string;
    if (encodeURI(reduxPlaySrc) !== currPlaySrc) {
      player.source = {
        type: "video",
        sources: [
          {
            src: reduxPlaySrc,
          },
        ],
      };
    }
  });
});
