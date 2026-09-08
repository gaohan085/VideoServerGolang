import Plyr from "plyr";
import "plyr/dist/plyr.css";
import plyrSvg from "plyr/dist/plyr.svg";
import { lazy, useEffect, useRef } from "react";
import useBoundStore from "../lib/zustand-store.ts";
import styles from "./player.module.scss";

const LazyInfo = lazy(() => import("./player-title.tsx"));

const isDev = process.env.NODE_ENV !== "production";

const mountPlyr = (node: HTMLElement): Plyr => {
  const plyr = new Plyr(node, {
    autoplay: false,
    autopause: true,
    debug: isDev,
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

  let trackedTimeout: NodeJS.Timeout;

  plyr.on("loadedmetadata", async (e) => {
    const instance = e.detail.plyr;
    const playSrc = instance.source as unknown as string;
    const historyTime = localStorage.getItem(playSrc);

    trackedTimeout = setTimeout(async () => {
      instance.currentTime = Number(historyTime);
      await instance.play();
    }, 2500);
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

  useBoundStore.subscribe(
    (state) => state.currentPlayingVideo,
    (current, previous) => {
      if (current.playSrc !== previous.playSrc) {
        const { posterUrl, playSrc } = current;
        plyr.stop();
        plyr.source = {
          type: "video",
          poster: posterUrl,
          sources: [{ src: playSrc }],
        };
        clearTimeout(trackedTimeout);
      }
    },
  );
  return plyr;
};

const Player = () => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const currentNode = ref.current;
    let plyr: Plyr | undefined = undefined;
    if (ref.current && !plyr) {
      plyr = mountPlyr(ref.current);
    }

    return () => {
      if (!currentNode && plyr) {
        plyr.stop();
        plyr.destroy();
      }
    };
  }, [ref]);
  return (
    <div className={styles.player}>
      <video ref={ref} />
      <LazyInfo />
    </div>
  );
};

export default Player;
