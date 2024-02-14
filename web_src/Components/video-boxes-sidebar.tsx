import { FcPrevious } from "react-icons/fc";
import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router";

import * as lib from "../lib";

import styles from "./video-boxes-sidebar.module.scss";

import { type VideoInfo, type ResWithActressName, DiskUsage } from ".";

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
  const [isActive, setIsActive] = useState<boolean>(false);
  const toggleActive: React.MouseEventHandler = () => setIsActive(!isActive);
  const { width } = lib.useWindowDimension();

  //监听窗口宽度
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
            {data.map((video, index) => {
              return <VideoBox key={index} {...video} />;
            })}
          </div>
          {width <= 992 && <DiskUsage />}
        </>
      )}
    </div>
  );
};