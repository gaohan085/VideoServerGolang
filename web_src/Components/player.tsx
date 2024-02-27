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

  return (
    <div className="title">
      <h4>
        {!!videoPlaying.name &&
          `${videoPlaying.name
            .slice(0, videoPlaying.name.lastIndexOf("."))
            .toLocaleUpperCase()} ${videoPlaying.title}`}
        {!videoPlaying.title && "没有正在播放"}
      </h4>
      {!!videoPlaying.title && (
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

  plyr.on("canplay", async (e) => {
    await new Promise((r) => setTimeout(r, 2500));
    await e.detail.plyr.play();
  });

  plyr.on("enterfullscreen", async () => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
    ) {
      window.screen.orientation.unlock();
      await window.screen.orientation.lock("landscape");
    }
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
