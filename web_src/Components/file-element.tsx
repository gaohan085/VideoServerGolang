import { motion } from "framer-motion";
import React, { useContext } from "react";
import { FcFile, FcVideoFile } from "react-icons/fc";
import useSWR from "swr";

import * as lib from "../lib";

import styles from "./file-element.module.scss";

import { Context, DirectoryProp } from ".";

export interface DirElement {
  name: string;
  isFile: boolean;
  isFolder: boolean;
  extName: string;
  playSrc?: string;
  currentPath: string; //relative path
}

const FileElement: React.FC<
  Pick<DirElement, "name" | "extName"> & {
    handleClick: React.MouseEventHandler;
    handleCtxMenu: React.MouseEventHandler;
    isSelected?: boolean;
    isPlaying?: boolean;
  }
> = (props) => {
  const { name, extName, handleClick, handleCtxMenu } = props;

  return (
    <motion.div
      className={styles.file}
      initial={{ paddingLeft: 15 }}
      animate={{ paddingLeft: 0 }}
      exit={{ paddingLeft: 15 }}
      transition={{ duration: 0.2, ease: "easeIn" }}
    >
      <p
        onClick={handleClick}
        onContextMenu={handleCtxMenu}
        title={lib.isVideo(extName) ? "播放视频" : undefined}
        className="file-element"
      >
        <span>{lib.isVideo(extName) ? <FcVideoFile /> : <FcFile />}</span>
        {name.replace("_", "-")}
      </p>
    </motion.div>
  );
};

export const InteractiveFileElement: React.FC<{
  elem: DirElement;
  mutateFunc: ReturnType<typeof useSWR<DirectoryProp, Error>>["mutate"];
}> = (props) => {
  const { clicked, setClicked, setRightClickElem, setMutateFunc, setPosition } =
    useContext(Context);
  const dispatch = lib.redux.useAppDispatch();

  const { elem, mutateFunc } = props;

  const handleClick: React.MouseEventHandler = () => {
    if (elem.extName === ".mp4")
      dispatch(lib.redux.setPlaySource(elem.playSrc!));
  };
  const handleCtxMenu: React.MouseEventHandler = (e) => {
    setPosition && setPosition({ ...e });
    clicked && setClicked && setClicked(false);
    setRightClickElem && setRightClickElem(elem);
    setMutateFunc && setMutateFunc(() => mutateFunc);
  };

  return (
    <FileElement
      {...elem}
      handleClick={handleClick}
      handleCtxMenu={handleCtxMenu}
    />
  );
};
