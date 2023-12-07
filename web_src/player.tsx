import { MediaPlayer, MediaPlayerInstance, MediaProvider, Poster } from "@vidstack/react";
import { DefaultAudioLayout, DefaultVideoLayout, defaultLayoutIcons } from "@vidstack/react/player/layouts/default";
import React, { useRef } from "react";

import * as lib from "./lib";
import styles from "./player.module.scss";


export const Player: React.FC = () => {
  const plySrc = lib.redux.useAppSelector(lib.redux.selectPlaySrc);
  const player = useRef<MediaPlayerInstance>(null)
  return (
    <div className={styles["player-box"]}>
      <MediaPlayer
        title="Sprite Fight"
        crossorigin
        playsinline
        ref={player}
        aspectRatio="16/9"
        src={plySrc}
        className={styles.player}
        viewType="video"
        autoplay
        volume={0.1}
      >
        <MediaProvider>
          <Poster
            className="vds-poster"
            alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
          />
        </MediaProvider>
        <DefaultAudioLayout icons={defaultLayoutIcons} />
        <DefaultVideoLayout
          icons={defaultLayoutIcons}
          smallLayoutWhen={false}
        />
      </MediaPlayer>
      <a>{"正在播放"}</a>
    </div>
  )
}