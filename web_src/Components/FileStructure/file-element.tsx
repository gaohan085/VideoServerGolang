"use client";

import { FcFilmReel, FcLock, FcQuestions } from "react-icons/fc";
import isVideo from "../../lib/is-video.ts";
import useBoundStore from "../../lib/zustand-store.ts";
import type { DirElement } from "../types.d.ts";
import styles from "./file-element.module.scss";
import RenameElement from "./rename-element-tanstack-form.tsx";

type FileElementProps = Readonly<{
  elem: DirElement;
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
    elem,
    handleClick,
    handleCtxMenu,
    isRename,
    isPlaying,
    isConverting,
    progress,
  } = props;

  return (
    <div className={styles.file}>
      <div
        className={
          isConverting
            ? "file-element convert"
            : isPlaying
              ? "file-element playing"
              : "file-element"
        }
        onClick={handleClick}
        onContextMenu={handleCtxMenu}
        title={isVideo(elem.extName) ? `播放 ${elem.name}` : elem.name}
      >
        <span>
          {isConverting ? (
            <FcLock />
          ) : elem.isVideo ? (
            <FcFilmReel />
          ) : (
            <FcQuestions />
          )}
        </span>

        {!isRename && <a className="name">{elem.name}</a>}
        {!!isConverting && (
          <a className="progress">
            {" "}
            {(progress! * 100).toFixed(2).toString() + "%"}
          </a>
        )}
        {!!isRename && <RenameElement {...elem} />}
      </div>
    </div>
  );
};

const InteractiveFileElement = ({ elem }: { readonly elem: DirElement }) => {
  const {
    isClicked,
    setIsClicked,
    setRClickElem,
    setPosition,
    renameElem,
    setRenameElem,
    unSetRenameElem,
    setVideoPlaying,
    currentPlayingVideo,
    videoCVQueue,
  } = useBoundStore((state) => state);

  const result = videoCVQueue.find(
    (video) => video.playSource === elem.playSrc,
  );
  const isConverting =
    !!result &&
    (result?.status === "pending" || result?.status === "converting");
  const progress = !!isConverting ? result.progress : 0;
  const isRename = renameElem === elem;
  const isPlaying =
    currentPlayingVideo.playSrc !== "" &&
    currentPlayingVideo.playSrc === elem.playSrc;

  const handleClick: React.MouseEventHandler = () => {
    if (!isRename && !isConverting) {
      elem.extName === ".mp4" && setVideoPlaying(elem);
      // 取消其他正在重命名的元素
      unSetRenameElem();
    }
  };
  const handleCtxMenu: React.MouseEventHandler = (e) => {
    if (!isRename && !isConverting) {
      isClicked && setIsClicked!(false);
      setPosition({ pageX: e.pageX, pageY: e.pageY });
      setRClickElem(elem);

      // 取消其他正在重命名的元素
      unSetRenameElem();
    }
  };

  return (
    <FileElement
      elem={elem}
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
