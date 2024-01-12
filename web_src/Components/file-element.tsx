import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { FcFile, FcVideoFile } from "react-icons/fc";

import * as lib from "../lib";

import styles from "./file-element.module.scss";

import {
  Context,
  InteractiveRenameComponent,
  type DirElement
} from ".";

const FileElement: React.FC<{
  readonly elem: DirElement;
  readonly handleClick: React.MouseEventHandler;
  readonly handleCtxMenu: React.MouseEventHandler;
  readonly isSelected?: boolean;
  readonly isPlaying: boolean;
  readonly isRename: boolean;
}> = (props) => {
  const { elem, handleClick, handleCtxMenu, isRename, isPlaying } = props;

  return (
    <motion.div
      animate={{ paddingLeft: 0 }}
      className={styles.file}
      exit={{ paddingLeft: 15 }}
      initial={{ paddingLeft: 15 }}
      transition={{ duration: 0.2, ease: "easeIn" }}
    >
      <a
        className={isPlaying ? "file-element playing" : "file-element"}
        onClick={handleClick}
        onContextMenu={handleCtxMenu}
        title={lib.isVideo(elem.extName) ? `播放 ${elem.name}` : elem.name}
      >
        <span>{lib.isVideo(elem.extName) ? <FcVideoFile /> : <FcFile />}</span>
        {!isRename && <>{elem.name}</>}
        {!!isRename && <InteractiveRenameComponent {...elem} />}
      </a>
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

  const handleClick: React.MouseEventHandler = () => {
    if (!isRename) {
      elem.extName === ".mp4" && dispatch(lib.redux.setVideoPlaying(elem));
      //取消其他正在重命名的元素
      setRenameElement!(undefined);
    }
  };
  const handleCtxMenu: React.MouseEventHandler = (e) => {
    if (!isRename) {
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
    />
  );
};
