import React, { useEffect, useState } from "react";
import { FcPrevious } from "react-icons/fc";
import * as redux from "../lib/reduxStore.ts";
import useWindowDimension from "../lib/useWindowDimension.ts";
import { DiskUsage } from "./status-bar.tsx";
import type { VideoInfo } from "./types.d.ts";
import styles from "./video-boxes-sidebar.module.scss";

const VideoWithPoster: React.FC<VideoInfo> = (props) => {
  const dispatch = redux.useAppDispatch();
  const videoPlaying = redux.useAppSelector(redux.selectVideoPlaying);
  const { title, posterUrl, playSrc, sn } = props;
  const [isPlaying, setIsplaying] = useState<boolean>(false);

  const handleClick = () => {
    dispatch(
      redux.setVideoPlaying({
        sn: sn,
        playSrc: playSrc,
        posterUrl: posterUrl,
      }),
    );
  };

  useEffect(() => {
    videoPlaying.playSrc === playSrc && setIsplaying(true);
    videoPlaying.playSrc !== playSrc && setIsplaying(false);
  }, [videoPlaying, playSrc]);

  return (
    <div
      className={!isPlaying ? "videobox" : "videobox playing"}
      onClick={handleClick}
    >
      <div className="img-box">
        <img src={posterUrl} loading="lazy" />
      </div>
      <div className="img-box-title">
        <a>{sn.toUpperCase()}</a>
        <br />
        <i>{title}</i>
      </div>
    </div>
  );
};

const VideoBoxes: React.FC<{ videos: VideoInfo[] }> = (props) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const toggleActive: React.MouseEventHandler = () => setIsActive(!isActive);
  const { width } = useWindowDimension();
  const { videos } = props;

  // 监听窗口宽度
  useEffect(() => {
    if (width >= 992) setIsActive(true);
  }, [width, isActive, setIsActive]);

  return (
    <div
      className={
        !isActive
          ? styles["video-box-sidebar"]
          : `${styles["video-box-sidebar"]} active`
      }
    >
      <span className="arrow" onClick={toggleActive}>
        <FcPrevious />
      </span>
      {!!isActive && (
        <>
          <div className="video-box-container">
            {videos.map((video, index) => {
              return <VideoWithPoster key={index} {...video} />;
            })}
          </div>
          {width <= 992 && <DiskUsage />}
        </>
      )}
    </div>
  );
};

export default VideoBoxes;
