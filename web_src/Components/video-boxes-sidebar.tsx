import { Link } from "@tanstack/react-router";
import { PiGenderFemaleBold } from "react-icons/pi";
import useBoundStore from "../lib/zustand-store.ts";
import type { VideoInfo } from "./types.d.ts";
import styles from "./video-boxes-sidebar.module.scss";

const VideoWithPoster = (props: Readonly<VideoInfo>) => {
  const { currentPlayingVideo, setVideoPlaying } = useBoundStore(
    (state) => state,
  );
  const { title, posterUrl, playSrc, sn, actors } = props;

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
    <div className={!isPlaying ? "videobox" : "videobox playing"}>
      <div className="img-box" onClick={handleClick}>
        <img src={!!posterUrl ? posterUrl : ""} loading="lazy" />
      </div>
      <div className="img-box-title">
        <div className="sn">
          <p onClick={handleClick}>{sn.toUpperCase()}</p>
          <>
            {!!actors &&
              actors
                .filter((actor) => actor.sex === "female")
                .map((actor, index) => (
                  <Link
                    to="/queryvideos"
                    search={{ actor: actor.actorName }}
                    key={index}
                    className="actor"
                  >
                    {actor.actorName}
                    <span>
                      <PiGenderFemaleBold />
                    </span>
                  </Link>
                ))}
          </>
        </div>
        <div className="title" onClick={handleClick}>
          <p>{title}</p>
        </div>
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
