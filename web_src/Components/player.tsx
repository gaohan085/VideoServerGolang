import Plyr from "plyr";
import "plyr/dist/plyr.css";
import plyrSvg from "plyr/dist/plyr.svg";
import React, { forwardRef, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import * as lib from "../lib";

import styles from "./player.module.scss";

const isProduction = process.env.NODE_ENV === "production";

const Title: React.FC = () => {
  const videoPlaying = lib.redux.useAppSelector(lib.redux.selectVideoPlaying);
  const serialNumber = videoPlaying.name.match(
    /([0-9]|[a-z]|[A-Z]){3,}-[0-9]{3,}/g,
  );

  return (
    <div className="title">
      <h4>
        {!!videoPlaying.name &&
          `${serialNumber ? serialNumber[0] : videoPlaying.name} ${videoPlaying.title}`}
        {!videoPlaying.name && "没有正在播放"}
      </h4>
      {!!videoPlaying.actress && (
        <Link to={`/actress/${videoPlaying.actress}`}>
          {videoPlaying.actress}
        </Link>
      )}
    </div>
  );
};

const ForwordPlayer = forwardRef(function Player(
  props,
  ref: React.LegacyRef<HTMLVideoElement> | undefined,
) {
  return <video ref={ref}></video>;
});

export const Player: React.FC = () => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let plyr: Plyr | undefined = undefined;
    if (ref.current && !plyr) {
      plyr = mountPlyr(ref.current);
    }
    return () => {
      if (!ref.current && plyr) plyr.stop(), plyr.destroy();
    };
  }, [ref]);
  return (
    <div className={styles.player}>
      <ForwordPlayer ref={ref} />
      <Title />
    </div>
  );
};

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
