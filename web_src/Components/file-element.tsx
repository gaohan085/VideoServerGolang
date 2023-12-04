import { motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { FcFile, FcVideoFile } from "react-icons/fc";

import * as lib from "../lib";

import styles from "./file-element.module.scss";

import {
  Context,
  InteractiveRenameComponent,
  type DirElement,
  type InterfaceMutateFunc,
} from ".";

const FileElement: React.FC<{
  elem: DirElement;
  handleClick: React.MouseEventHandler;
  handleCtxMenu: React.MouseEventHandler;
  isSelected?: boolean;
  isPlaying?: boolean;
  isRename?: boolean;
}> = (props) => {
  const { elem, handleClick, handleCtxMenu, isRename } = props;

  return (
    <motion.div
      className={styles.file}
      initial={{ paddingLeft: 15 }}
      animate={{ paddingLeft: 0 }}
      exit={{ paddingLeft: 15 }}
      transition={{ duration: 0.2, ease: "easeIn" }}
    >
      <a
        onClick={handleClick}
        onContextMenu={handleCtxMenu}
        title={lib.isVideo(elem.extName) ? `播放 ${elem.name}` : elem.name}
        className="file-element"
      >
        <span>{lib.isVideo(elem.extName) ? <FcVideoFile /> : <FcFile />}</span>
        {!isRename && <>{elem.name}</>}
        {isRename && <InteractiveRenameComponent {...elem} />}
      </a>
    </motion.div>
  );
};

export const InteractiveFileElement: React.FC<{
  elem: DirElement;
  mutateFunc: InterfaceMutateFunc;
}> = (props) => {
  const {
    clicked,
    setClicked,
    setRightClickElem,
    setMutateFunc,
    setPosition,
    renameElement,
    setRenameElement,
  } = useContext(Context);
  const dispatch = lib.redux.useAppDispatch();
  const { elem, mutateFunc } = props;
  const [isRename, setIsRename] = useState<boolean>(false);

  const handleClick: React.MouseEventHandler = () => {
    if (!isRename) {
      elem.extName === ".mp4" &&
        dispatch(lib.redux.setPlaySource(elem.playSrc!));
      //取消其他正在重命名的元素
      setRenameElement!(undefined);
    }
  };
  const handleCtxMenu: React.MouseEventHandler = (e) => {
    if (!isRename) {
      clicked && setClicked!(false);
      setPosition!({ ...e });
      setRightClickElem!(elem);
      setMutateFunc!(() => mutateFunc);
      //取消其他正在重命名的元素
      setRenameElement!(undefined);
    }
  };

  useEffect(() => {
    elem === renameElement ? setIsRename(true) : setIsRename(false);
    return;
  }, [elem, renameElement, setIsRename]);

  return (
    <FileElement
      elem={elem}
      handleClick={handleClick}
      handleCtxMenu={handleCtxMenu}
      isRename={isRename}
    />
  );
};
