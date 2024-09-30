import React, { forwardRef, useEffect, useRef } from "react";
import ArtPlayer from "artplayer";
import { Title } from "./player-title";
import * as styles from "./artplayer.module.scss";
import * as lib from "../lib";

const ForwardArtPlayer = forwardRef(function ArtPlayer(
  props,
  ref: React.LegacyRef<HTMLDivElement> | undefined,
) {
  return <div ref={ref} />;
});

const APlayer: React.FC<{ option: Omit<ArtPlayer["option"], "container"> }> = (
  props,
) => {
  const { option } = props;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const art = new ArtPlayer({
      ...option,
      container: ref.current!,
    });

    art.on("video:loadedmetadata", async () => {
      await new Promise((r) => setTimeout(r, 2500));
      await art.play();
    });

    lib.redux.store.subscribe(() => {
      const playingVideo = lib.redux.store.getState().redux.playingVideo;

      if (encodeURI(playingVideo.playSrc) !== art.url) {
        art.url = playingVideo.playSrc;
        art.poster = "/assets/poster/" + playingVideo?.poster;
      }
    });

    return () => {
      if (art && art.destroy) {
        art.destroy(false);
      }
    };
  }, []);

  return (
    <div className={styles.artplayer}>
      <ForwardArtPlayer ref={ref} />
      <Title />
    </div>
  );
};

export const Art: React.FC = (props) => {
  const option: Omit<ArtPlayer["option"], "container"> = {
    url: "",
    screenshot: true,
    autoplay: false,
    setting: true,
    hotkey: true,
    pip: true,
    mutex: true,
    fullscreen: true,
    fullscreenWeb: true,
    playsInline: true,
    autoOrientation: true,
    theme: "#e85982",
    autoPlayback: true,
    id: "playbackid",
  };

  return (
    <div>
      <APlayer option={option} />
    </div>
  );
};
