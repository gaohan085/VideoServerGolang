import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { defaultLayoutIcons, DefaultVideoLayout } from "@vidstack/react/player/layouts/default";
import React from "react";

import * as lib from "./lib"

export const Player: React.FC = () => {
  const playingVideo = lib.redux.useAppSelector(lib.redux.selectVideoPlaying)

  return (
    <MediaPlayer title="Sprite Fight" src={playingVideo ? playingVideo.playSrc : ""} aspectRatio="16/9">
      <MediaProvider />
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  )
}