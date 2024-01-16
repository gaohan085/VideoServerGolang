import Plyr from "plyr";
import "plyr/dist/plyr.css";
import svg from "plyr/dist/plyr.svg";

import * as lib from "./lib";

export const mountPlyr = (node: HTMLElement) => {
  const plyr = new Plyr(node, {
    autoplay: false,
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
    iconUrl: svg,
  });

  lib.redux.store.subscribe(() => {
    const videoPlaying = lib.redux.store.getState().redux.playingVideo;
    const currPlaySrc = plyr.source as unknown as string;
    if (encodeURI(videoPlaying!.playSrc) !== currPlaySrc) {
      plyr.source = {
        type: "video",
        title: videoPlaying?.title,
        poster: "/assets/poster/" + videoPlaying?.poster,
        sources: [
          {
            src: videoPlaying!.playSrc,
          },
        ],
      };
      plyr.once("ready", async (e) => {
        console.log("ready");
        await new Promise((r) => setTimeout(r, 2500));
        await e.detail.plyr.play();
      });
    }

    document.getElementById("title")!.textContent = videoPlaying
      ? `正在播放 ${videoPlaying.name
          .slice(0, videoPlaying.name.lastIndexOf("."))
          .toLocaleUpperCase()}-${videoPlaying.title}`
      : "没有正在播放";

    document.title = videoPlaying
      ? `正在播放 ${videoPlaying.name
          .slice(0, videoPlaying.name.lastIndexOf("."))
          .toLocaleUpperCase()}-${videoPlaying.title}`
      : "没有正在播放";
  });
  return plyr;
};
