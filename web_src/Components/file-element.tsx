import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { FcFilmReel, FcLock, FcQuestions } from "react-icons/fc";

import * as lib from "../lib";

import * as styles from "./file-element.module.scss";

import { Context, InteractiveRenameComponent, WsContext, type DirElement } from ".";


const FileElement: React.FC<{
  readonly elem: DirElement;
  readonly handleClick: React.MouseEventHandler;
  readonly handleCtxMenu: React.MouseEventHandler;
  readonly isSelected?: boolean;
  readonly isPlaying: boolean;
  readonly isRename: boolean;
  readonly isConverting: boolean
  readonly progress?: number
}> = (props) => {
  const { elem, handleClick, handleCtxMenu, isRename, isPlaying, isConverting, progress } = props;

  return (
    <motion.div
      animate={{ paddingLeft: 0 }}
      className={styles.file}
      exit={{ paddingLeft: 15 }}
      initial={{ paddingLeft: 15 }}
      transition={{ duration: 0.2, ease: "easeIn" }}
    >
      <div
        className={isConverting ? "file-element convert" : isPlaying ? "file-element playing" : "file-element"}
        onClick={handleClick}
        onContextMenu={handleCtxMenu}
        title={lib.isVideo(elem.extName) ? `播放 ${elem.name}` : elem.name}
      >
        <span>
          {isConverting ? <FcLock /> : lib.isVideo(elem.extName) ? <FcFilmReel /> : <FcQuestions />}
        </span>

        {!isRename && <a className="name">{elem.name}</a>}
        {!!isConverting && <a className="progress">{" "}{(progress! * 100).toFixed(2).toString() + "%"}</a>}
        {!!isRename && <InteractiveRenameComponent {...elem} />}
      </div>
    </motion.div>
  );
};

export const InteractiveFileElement: React.FC<{
  readonly elem: DirElement;
}> = ({ elem }) => {
  const {
    clicked,
    setClicked,
    setRightClickElem,
    setPosition,
    renameElement,
    setRenameElement,
  } = useContext(Context);
  const dispatch = lib.redux.useAppDispatch();
  const [isRename, setIsRename] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState<boolean>(false)
  const { convertingElems } = useContext(WsContext)
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    const filterElem = convertingElems?.filter(video => video.playSource === elem.playSrc)
    if (filterElem?.length === 1) {
      if (filterElem[0].status === "converting" || filterElem[0].status === "pending") {
        setIsConverting(true)
        setProgress(filterElem[0].progress)
        console.log("AAAAadasa")
      } else {
        setIsConverting(false)
      }
    }
    return () => {
      setIsConverting(false)
    }
  }, [elem, convertingElems, setIsConverting])

  const handleClick: React.MouseEventHandler = () => {
    if (!isRename && !isConverting) {
      elem.extName === ".mp4" && dispatch(lib.redux.setVideoPlaying(elem));
      //取消其他正在重命名的元素
      setRenameElement!(undefined);
    }
  };
  const handleCtxMenu: React.MouseEventHandler = (e) => {
    if (!isRename && !isConverting) {
      clicked && setClicked!(false);
      setPosition!({ ...e });
      setRightClickElem!(elem);

      //取消其他正在重命名的元素
      setRenameElement!(undefined);
    }
  };

  useEffect(() => {
    elem === renameElement ? setIsRename(true) : setIsRename(false);
    return;
  }, [elem, renameElement, setIsRename]);

  //监听正在播放
  const currentPlayVideo = lib.redux.useAppSelector(
    lib.redux.selectVideoPlaying,
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  useEffect(() => {
    currentPlayVideo?.playSrc !== "" &&
      currentPlayVideo?.playSrc === elem.playSrc &&
      setIsPlaying(true);
    return () => setIsPlaying(false);
  }, [currentPlayVideo?.playSrc, elem, setIsPlaying]);

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
