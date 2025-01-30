import Plyr from "plyr";
import "plyr/dist/plyr.css";
import plyrSvg from "plyr/dist/plyr.svg";
import React, { forwardRef, lazy, useEffect, useRef } from "react";
import * as lib from "../lib";
import styles from "./player.module.scss";

const LazyPlayerTitle = lazy(() => import("./player-title"));
const isProduction = process.env.NODE_ENV === "production";

const ForwordPlayer = forwardRef(function Player(
  props,
  ref: React.LegacyRef<HTMLVideoElement> | undefined,
) {
  return <video ref={ref}></video>;
});

const mountPlyr = (node: HTMLElement): Plyr => {
  const plyr = new Plyr(node, {
    autoplay: false,
    autopause: true,
    debug: !isProduction,
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
    seekTime: 5,
    blankVideo: "",
    keyboard: { focused: false, global: true },
    loadSprite: false,
    iconUrl: plyrSvg,
  });

  plyr.on("loadedmetadata", async (e) => {
    const instance = e.detail.plyr;
    const playSrc = instance.source as unknown as string;
    const historyTime = localStorage.getItem(playSrc);
    await new Promise((r) => setTimeout(r, 2500));
    instance.currentTime = Number(historyTime);
    await instance.play();
  });

  plyr.on("enterfullscreen", async () => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
    ) {
      window.screen.orientation.unlock();
      await window.screen.orientation.lock("landscape");
    }
  });

  plyr.on("timeupdate", (e) => {
    const instance = e.detail.plyr;
    const source = instance.source as unknown as string;
    const currentTime = instance.currentTime;
    localStorage.setItem(source, String(currentTime));
  });

  lib.redux.store.subscribe(() => {
    const videoPlaying = lib.redux.store.getState().redux.playingVideo;
    const currPlaySrc = plyr.source as unknown as string;
    if (encodeURI(videoPlaying.playSrc) !== currPlaySrc) {
      plyr.source = {
        type: "video",
        title: videoPlaying?.title,
        poster: "/assets/poster/" + videoPlaying?.poster,
        sources: [
          {
            src: videoPlaying.playSrc,
          },
        ],
      };
    }
  });

  return plyr;
};

export const Player: React.FC = () => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let plyr: Plyr | undefined = undefined;
    if (ref.current && !plyr) {
      plyr = mountPlyr(ref.current);
    }
    return () => {
      if (!ref.current && plyr) {
        plyr.stop(); plyr.destroy();
      };
    };
  }, [ref]);
  return (
    <div className={styles.player}>
      <ForwordPlayer ref={ref} />
      <LazyPlayerTitle />
    </div>
  );
};

export default Player;