import Plyr from "plyr";
import { type Unsubscribe } from "redux";
import "plyr/dist/plyr.css";

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
    loadSprite: false,
    iconUrl: "/dist/plyr.svg",
  });

  let unSubscriber: Unsubscribe | undefined = undefined;

  plyr.once("ready", (e) => {
    const player = e.detail.plyr;
    unSubscriber = lib.redux.store.subscribe(() => {
      const videoPlaying = lib.redux.store.getState().redux.playingVideo;
      player.source = {
        type: "video",
        sources: [
          {
            src: videoPlaying!.playSrc,
          },
        ],
      };
    });
  });

  plyr.on("playing", (e) => {
    const player = e.detail.plyr;
    unSubscriber!();
    lib.redux.store.subscribe(() => {
      const videoPlaying = lib.redux.store.getState().redux.playingVideo;
      const currPlaySrc = player.source as unknown as string;
      if (encodeURI(videoPlaying!.playSrc) !== currPlaySrc) {
        player.source = {
          type: "video",
          sources: [
            {
              src: videoPlaying!.playSrc,
            },
          ],
        };
        player.pause();
      }
    });
  });

  lib.redux.store.subscribe(() => {
    const videoPlaying = lib.redux.store.getState().redux.playingVideo;
    document.getElementById("title")!.textContent = videoPlaying
      ? `正在播放 ${videoPlaying.name
          .slice(0, videoPlaying.name.lastIndexOf("."))
          .toLocaleUpperCase()}`
      : "没有正在播放";
  });

  return plyr;
};
