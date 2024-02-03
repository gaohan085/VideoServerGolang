import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { PlyrLayout, plyrLayoutIcons } from "@vidstack/react/player/layouts/plyr";
import React from "react";
import { Link } from "react-router-dom";

import * as lib from "../lib";

import styles from "./player.module.scss";

export const Player: React.FC = () => {
  const videoPlaying = lib.redux.useAppSelector(lib.redux.selectVideoPlaying);

  return (
    <div className={styles.player}>
      <MediaPlayer
        title={videoPlaying.title}
        src={videoPlaying.playSrc}
        aspectRatio="16/9"
        load="visible" posterLoad="visible"
        poster={`/assets/poster/${videoPlaying.poster}`}
        autoPlay={false}
        viewType="video"
        controls={false}
        fullscreenOrientation="landscape"
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
          clickToPlay={true}
        />
      </MediaPlayer>
      <div className="title">
        <h4>
          {!!videoPlaying.title &&
            `${videoPlaying.name
              .slice(0, videoPlaying.name.lastIndexOf("."))
              .toLocaleUpperCase()} ${videoPlaying.title}`}
          {!videoPlaying.title && "没有正在播放"}
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
