import Plyr from "plyr";
import { Unsubscribe } from "redux";

import * as lib from "./lib";

export const mountPlyr = (node: HTMLElement) => {
  const plyr = new Plyr(node, {
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
        console.log(player.currentTime);
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

  return plyr;
};
