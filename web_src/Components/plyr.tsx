import { usePlyr, type APITypes, type PlyrProps } from "plyr-react";
import "plyr-react/plyr.css";
import React, { Ref, forwardRef, useRef } from "react";
import { selectPlaySrc, useAppSelector } from "../lib/reduxStore";
import styles from "./plyr.module.scss";

const Plyr = forwardRef(function Player(props: PlyrProps, ref: Ref<APITypes>) {
  const { source, options = null, ...rest } = props;
  const raptorRef = usePlyr(ref, {
    source,
    options,
  });

  return <video ref={raptorRef} className='plyr-react plyr' {...rest} />;
});

export default function Player() {
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
      />
      <p>
        {playSrc === "" && "没有正在播放"}
        {playSrc !== "" &&
          `正在播放: ${playSrc.slice(playSrc.lastIndexOf("/") + 1)}`}
      </p>
    </div>
  );
}
