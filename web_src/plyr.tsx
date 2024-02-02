import Plyr from "plyr";
import "plyr/dist/plyr.css";
import iconSvg from "plyr/dist/plyr.svg";
import React, { forwardRef, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

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
    iconUrl: iconSvg,
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
  return plyr;
};

export const Player: React.FC = () => {
  const ref = useRef(null);
  const videoPlaying = lib.redux.useAppSelector(lib.redux.selectVideoPlaying);

  useEffect(() => {
    if (videoPlaying) {
      document.title = `${videoPlaying.name
        .slice(0, videoPlaying.name.lastIndexOf("."))
        .toLocaleUpperCase()} ${videoPlaying.title}`;
    }
  }, [videoPlaying]);

  useEffect(() => {
    let plyr: Plyr;
    if (ref.current) {
      plyr = mountPlyr(ref.current);
    }
    return () => {
      !ref.current && plyr.destroy();
    };
  }, [ref]);

  return (
    <div className="player">
      <ForwordPlyr ref={ref} />
      <div className="title">
        <h4>
          {videoPlaying
            ? `${videoPlaying.name
              .slice(0, videoPlaying.name.lastIndexOf("."))
              .toLocaleUpperCase()} ${videoPlaying.title}`
            : "没有正在播放"}
        </h4>
        {!!videoPlaying && (
          <Link to={`/actress/${videoPlaying.actress}`}>{videoPlaying.actress}</Link>
        )}
      </div>
    </div>
  );
};

const ForwordPlyr = forwardRef(function ForwordPlyer(
  props,
  ref: React.LegacyRef<HTMLVideoElement> | undefined,
) {
  return <video ref={ref}></video>;
});
