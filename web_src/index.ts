/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import Plyr from "plyr";
import "./index.css";

import * as App from "./App";
import * as lib from "./lib";

import type { Unsubscribe } from "redux";

const app = document.getElementById("app");
App.renderSidebar(app!);

const statusbar = document.getElementById("statusbar");
App.renderStatusbar(statusbar!);

const videoNode = document.getElementById("plyr");
const plyr = new Plyr(videoNode!, {
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

let unSubscriber: Unsubscribe | undefined = undefined;

plyr.once("ready", (e) => {
  const player = e.detail.plyr;
  unSubscriber = lib.redux.store.subscribe(() => {
    const reduxPlaySrc = lib.redux.store.getState().redux.playSource;
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
  unSubscriber && unSubscriber();
  lib.redux.store.subscribe(() => {
    const reduxPlaySrc = lib.redux.store.getState().redux.playSource;
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

if ((module as any).hot) {
  (module as any).hot.accept("./App.tsx");
}
