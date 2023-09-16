import { Context } from "./sidebar";
import isVideo from "../lib/is-video";
import { motion } from "framer-motion";
import styles from "./file-element.module.scss";
import useSWR from "swr";
import { FcFile, FcVideoFile } from "react-icons/fc";
import React, { useContext, useEffect, useState } from "react";
import {
  selectPlaySrc,
  setPlaySource,
  useAppDispatch,
  useAppSelector,
} from "../lib/reduxStore";

export interface DirChildElem {
  name: string;
  isFile: boolean;
  isFolder: boolean;
  extName: string;
  playSrc?: string;
  currentPath: string; //relative path
}
export interface Folder {
  parentFolder: string; //relative path
  currentPath: string; //relative path
  childElem: DirChildElem[];
}

const FileElem: React.FC<
  DirChildElem & {
    mutateFunc: ReturnType<typeof useSWR<Folder, Error>>["mutate"];
  }
> = (props) => {
  const dispatch = useAppDispatch();
  const [rightClicked, setRightClicked] = useState<boolean>(false);
  const {
    clicked,
    setClicked,
    setPosition,
    setMutateFunc,
    rightClickElem,
    setRightClickElem,
  } = useContext(Context);
  const currPlaySrc = useAppSelector(selectPlaySrc);

  // Listen context right clicked element and change this component rightClicked status
  useEffect(() => {
    if (
      rightClickElem &&
      rightClickElem.currentPath === props.currentPath &&
      rightClickElem.name === props.name
    ) {
      setRightClicked(true);
    } else {
      setRightClicked(false);
    }
  }, [rightClickElem, setRightClicked, props]);

  return (
    <motion.div
      className={styles.file}
      initial={{ paddingLeft: 10 }}
      animate={{ paddingLeft: 0 }}
      exit={{ paddingLeft: 10 }}
      transition={{ duration: 0.2, ease: "easeIn" }}>
      <p
        onClick={() => {
          if (props.extName === ".mp4") dispatch(setPlaySource(props.playSrc));
        }}
        onContextMenu={(e) => {
          if (clicked) setClicked(false);
          setPosition({ pageX: e.pageX, pageY: e.pageY });
          setMutateFunc(() => props.mutateFunc);
          setRightClickElem(props);
        }}
        title={props.name}
        className={
          rightClicked
            ? "name selected"
            : currPlaySrc === props.playSrc && props.playSrc !== ""
            ? "name playing"
            : "name"
        }>
        <span>{isVideo(props.extName) ? <FcVideoFile /> : <FcFile />}</span>
        {props.name.replace("_", "-")}
      </p>
    </motion.div>
  );
};

export default FileElem;
