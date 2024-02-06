import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router";

import * as lib from "../lib";

import styles from "./video-boxes.module.scss";

import { type VideoInfo, type ResWithActressName } from ".";

export const VideoBox: React.FC<VideoInfo> = (props) => {
  const dispatch = lib.redux.useAppDispatch();
  const videoPlaying = lib.redux.useAppSelector(lib.redux.selectVideoPlaying);
  const { title, posterName, serialNumber, playSrc, actress } = props;
  const [isPlaying, setIsplaying] = useState<boolean>(false);

  const handleClick = () => {
    dispatch(
      lib.redux.setVideoPlaying({
        name: serialNumber,
        title: title,
        playSrc: playSrc,
        extName: "",
        isFile: true,
        isFolder: false,
        currentPath: "",
        actress: actress,
        poster: posterName,
      }),
    );
  };

  useEffect(() => {
    videoPlaying.playSrc === playSrc && setIsplaying(true);
    videoPlaying.playSrc !== playSrc && setIsplaying(false);
  }, [videoPlaying, playSrc]);

  return (
    <div className={!isPlaying ? "videobox" : "videobox playing"}>
      <div className="img-box">
        <a onClick={handleClick}>
          <img src={`/assets/poster/${posterName}`} loading="lazy" />
        </a>
      </div>
      <div className="title">
        <a onClick={handleClick}>{title}</a>
      </div>
    </div>
  );
};

export const VideoBoxes: React.FC = () => {
  const { data } = useLoaderData() as ResWithActressName;

  return (
    <div className={styles.videos}>
      {data.map((video, index) => {
        return <VideoBox key={index} {...video} />;
      })}
    </div>
  );
};
