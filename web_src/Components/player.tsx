import "plyr-react/plyr.css";
import styles from "./player.module.scss";
import { type APITypes, type PlyrProps, usePlyr } from "plyr-react";
import React, { forwardRef, Ref, useRef } from "react";
import { selectPlaySrc, useAppSelector } from "../lib/reduxStore";

const Plyr = forwardRef(function Player(props: PlyrProps, ref: Ref<APITypes>) {
  const { source, options = null, ...rest } = props;
  const raptorRef = usePlyr(ref, {
    source,
    options,
  });

  return <video ref={raptorRef} className='plyr-react plyr' {...rest} />;
});

export function Player() {
  const ref = useRef<APITypes>(null);
  const playSrc = useAppSelector(selectPlaySrc);
  return (
    <div className={styles.video}>
      <Plyr
        ref={ref}
        source={{
          type: "video",
          sources: [
            {
              src: playSrc,
            },
          ],
        }}
        options={{
          autoplay: true,
          clickToPlay: true,
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
        }} //Set initinal player status as pause

        style={{borderRadius: "20px"}}
      />
      <p>
        {playSrc === "" && "没有正在播放"}
        {playSrc !== "" &&
          `正在播放: ${playSrc.slice(playSrc.lastIndexOf("/") + 1)}`}
      </p>
    </div>
  );
}
