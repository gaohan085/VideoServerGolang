import {
  MediaPlayer,
  MediaProvider,
  type MediaPlayerInstance,
} from "@vidstack/react";
import {
  PlyrLayout,
  plyrLayoutIcons,
} from "@vidstack/react/player/layouts/plyr";
import React, { useRef } from "react";
import { Link } from "react-router-dom";

import * as lib from "../lib";

import styles from "./player.module.scss";

export const Player: React.FC = () => {
  const videoPlaying = lib.redux.useAppSelector(lib.redux.selectVideoPlaying);

  const player = useRef<MediaPlayerInstance>(null);

  return (
    <div className={styles.player}>
      <MediaPlayer
        title={videoPlaying.title}
        src={videoPlaying.playSrc}
        aspectRatio="16/9"
        load="visible"
        posterLoad="visible"
        poster={`/assets/poster/${videoPlaying.poster}`}
        autoPlay={false}
        viewType="video"
        controls={false}
        playsInline={true}
        fullscreenOrientation="landscape"
        controlsDelay={2000}
        hideControlsOnMouseLeave={true}
        volume={0.5}
        onCanPlay={async () => {
          await new Promise((r) => setTimeout(r, 2000));
          await player.current?.play();
        }}
        ref={player}
      >
        <MediaProvider />
        <PlyrLayout
          icons={plyrLayoutIcons}
          controls={[
            "play-large",
            "play",
            "fast-forward",
            "progress",
            "current-time",
            "mute+volume",
            "captions",
            "settings",
            "pip",
            "fullscreen",
          ]}
          seekTime={5}
          displayDuration={true}
          clickToFullscreen={true}
          clickToPlay={
            !/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(
              navigator.userAgent,
            )
          }
        />
      </MediaPlayer>
      <div className="title">
        <h4>
          {!!videoPlaying &&
            videoPlaying.name.includes(".") &&
            `${videoPlaying.name
              .slice(0, videoPlaying.name.lastIndexOf("."))
              .toLocaleUpperCase()} ${videoPlaying.title}`}
          {!!videoPlaying &&
            !videoPlaying.name.includes(".") &&
            `${videoPlaying.name.toLocaleUpperCase()} ${videoPlaying.title}`}
          {!videoPlaying.playSrc && "没有正在播放"}
        </h4>
        {!!videoPlaying.actress && (
          <Link to={`/actress/${videoPlaying.actress}`}>
            {videoPlaying.actress}
          </Link>
        )}
      </div>
    </div>
  );
};
