import Plyr from "plyr";
import "plyr/dist/plyr.css";
import svg from "plyr/dist/plyr.svg";
import React, { forwardRef, useEffect, useRef } from "react";

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
        await new Promise((r) => setTimeout(r, 2500));
        await e.detail.plyr.play();
      });
    }
  });

  plyr.on("enterfullscreen", async () => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
    ) {
      window.screen.orientation.unlock();
      await window.screen.orientation.lock("landscape");
    }
  });
};


export const Plyer: React.FC = () => {
  const ref = useRef(null)
  const videoPlaying = lib.redux.useAppSelector(lib.redux.selectVideoPlaying)

  document.title = videoPlaying
    ? `${videoPlaying.name
      .slice(0, videoPlaying.name.lastIndexOf("."))
      .toLocaleUpperCase()} ${videoPlaying.title}`
    : "没有正在播放";

  useEffect(() => {
    if (ref.current) {
      mountPlyr(ref.current)
    }
  }, [ref])

  return (
    <div className="player">
      <ForwordPlyr ref={ref} />
      <h4 className="title">{videoPlaying
        ? `${videoPlaying.name
          .slice(0, videoPlaying.name.lastIndexOf("."))
          .toLocaleUpperCase()} ${videoPlaying.title}`
        : "没有正在播放"}</h4>
    </div>
  )
}

const ForwordPlyr = forwardRef(function ForwordPlyer(props, ref: React.LegacyRef<HTMLVideoElement> | undefined) {
  return <video ref={ref}></video>
})