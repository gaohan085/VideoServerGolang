import React, { useEffect, useState } from "react";
import { FcPrevious } from "react-icons/fc";
import { useLoaderData, useNavigation } from "react-router";
import * as redux from "../lib/reduxStore.ts";
import useWindowDimension from "../lib/useWindowDimension.ts";
import Spinner from "./spinner.tsx";
import {DiskUsage} from "./status-bar.tsx";
import type { ResWithActressName, VideoInfo } from "./types.d.ts";
import styles from "./video-boxes-sidebar.module.scss";

const VideoBox: React.FC<VideoInfo> = (props) => {
  const dispatch = redux.useAppDispatch();
  const videoPlaying = redux.useAppSelector(redux.selectVideoPlaying);
  const { title, posterName, serialNumber, playSrc, actress, sourceUrl } =
    props;
  const [isPlaying, setIsplaying] = useState<boolean>(false);

  const handleClick = () => {
    dispatch(
      redux.setVideoPlaying({
        name: serialNumber,
        title: title,
        playSrc: playSrc,
        extName: "",
        isFile: true,
        isFolder: false,
        currentPath: "",
        actress: actress,
        poster: posterName,
        sourceUrl: sourceUrl,
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
        <img src={`/assets/poster/${posterName}`} loading="lazy" />
      </div>
      <div className="img-box-title">
        <a>{`${serialNumber} ${title}`}</a>
      </div>
    </div>
  );
};

const VideoBoxes: React.FC = () => {
  const { data } = useLoaderData<ResWithActressName>();
  const [isActive, setIsActive] = useState<boolean>(false);
  const toggleActive: React.MouseEventHandler = () => setIsActive(!isActive);
  const { width } = useWindowDimension();

  const navigation = useNavigation();

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
            {navigation.state === "loading" ? (
              <Spinner fontSize={24} />
            ) : (
              <>
                {data.map((video, index) => {
                  return <VideoBox key={index} {...video} />;
                })}
              </>
            )}
          </div>
          {width <= 992 && <DiskUsage />}
        </>
      )}
    </div>
  );
};

export default VideoBoxes;