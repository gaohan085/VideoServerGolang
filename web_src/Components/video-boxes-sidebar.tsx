import useBoundStore from "../lib/zustand-store.ts";
import type { VideoInfo } from "./types.d.ts";
import styles from "./video-boxes-sidebar.module.scss";

const VideoWithPoster = (props: Readonly<VideoInfo>) => {
  const { currentPlayingVideo, setVideoPlaying } = useBoundStore(
    (state) => state,
  );
  const { title, posterUrl, playSrc, sn } = props;

  const handleClick = () => {
    setVideoPlaying({
      sn: sn,
      name: title,
      playSrc: playSrc,
      posterUrl: posterUrl,
    });
  };
  const isPlaying = currentPlayingVideo.playSrc === playSrc;

  return (
    <div
      className={!isPlaying ? "videobox" : "videobox playing"}
      onClick={handleClick}
    >
      <div className="img-box">
        <img src={posterUrl === "" ? undefined : posterUrl} loading="lazy" />
      </div>
      <div className="img-box-title">
        <a>{sn.toUpperCase()}</a>
        <br />
        <i>{title}</i>
      </div>
    </div>
  );
};

const VideoBoxes = ({ videos }: Readonly<{ videos: VideoInfo[] }>) => {
  return (
    <div className={styles["video-box-container"]}>
      {videos.map((video, index) => {
        return <VideoWithPoster key={index} {...video} />;
      })}
    </div>
  );
};

export default VideoBoxes;
