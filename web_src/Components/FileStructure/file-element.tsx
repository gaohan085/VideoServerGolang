"use client";

import { FcFilmReel, FcLock, FcQuestions } from "react-icons/fc";
import isVideo from "../../lib/is-video.ts";
import useBoundStore from "../../lib/zustand-store.ts";
import type { RespElement } from "../types.d.ts";
import styles from "./file-element.module.scss";
import RenameElement from "./rename-element-tanstack-form.tsx";
import { FsElementProptertiesClass } from "../../lib/element-properties.ts";

type FileElementProps = Readonly<{
  properties: FsElementProptertiesClass;
  handleClick: React.MouseEventHandler;
  handleCtxMenu: React.MouseEventHandler;
  isSelected?: boolean;
  isPlaying: boolean;
  isRename: boolean;
  isConverting: boolean;
  progress?: number;
}>;

const FileElement = (props: FileElementProps) => {
  const {
    properties,
    handleClick,
    handleCtxMenu,
    isRename,
    isPlaying,
    isConverting,
    progress,
  } = props;

  return (
    <div className={styles.file}>
      <a
        className={
          isConverting
            ? "file-element convert"
            : isPlaying
              ? "file-element playing"
              : "file-element"
        }
        onClick={handleClick}
        onContextMenu={handleCtxMenu}
        title={isVideo(properties.extName) ? `播放 ${properties.name}` : properties.name}
      >
        <span>
          {isConverting ? (
            <FcLock />
          ) : properties.isVideo ? (
            <FcFilmReel />
          ) : (
            <FcQuestions />
          )}
        </span>

        {!isRename && <>{properties.name}</>}
        {!!isConverting && (
          <a className="progress">
            {" "}
            {(progress! * 100).toFixed(2).toString() + "%"}
          </a>
        )}
        {!!isRename && <RenameElement elem={properties} cwd={properties.cwd} />}
      </a>
    </div>
  );
};

const InteractiveFileElement = ({ elem , cwd }: { readonly elem: RespElement, readonly cwd : string }) => {
  const {
    isClicked,
    setIsClicked,
    setRClickElem,
    setPosition,
    renameElem,
    unSetRenameElem,
    setVideoPlaying,
    currentPlayingVideo,
    videoCVQueue,
  } = useBoundStore((state) => state);

  const properties = new FsElementProptertiesClass(elem, cwd);

  const result = videoCVQueue.find(
    (video) => video.playSource === properties.playSrc,
  );
  const isConverting =
    !!result &&
    (result?.status === "pending" || result?.status === "converting");
  const progress = isConverting ? result.progress : 0;
  const isRename = renameElem.path === properties.cwd && renameElem.name === properties.name;
  const isPlaying =
    currentPlayingVideo.playSrc !== "" &&
    currentPlayingVideo.playSrc === properties.playSrc;

  const handleClick: React.MouseEventHandler = () => {
    if (!isRename && !isConverting) {
      properties.extName === ".mp4" && setVideoPlaying({
        playSrc: properties.playSrc,
        sn: properties.sn,
        name: properties.name
      });
      // 取消其他正在重命名的元素
      unSetRenameElem();
    }
  };
  const handleCtxMenu: React.MouseEventHandler = (e) => {
    if (!isRename && !isConverting) {
      isClicked && setIsClicked!(false);
      setPosition({ pageX: e.pageX, pageY: e.pageY });
      setRClickElem({...elem, path: properties.cwd});

      // 取消其他正在重命名的元素
      unSetRenameElem();
    }
  };

  return (
    <FileElement
      properties={properties}
      handleClick={handleClick}
      handleCtxMenu={handleCtxMenu}
      isPlaying={isPlaying}
      isRename={isRename}
      isConverting={isConverting}
      progress={progress}
    />
  );
};

export default InteractiveFileElement;
