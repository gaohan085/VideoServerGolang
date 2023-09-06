import { Context } from "./sidebar";
import { OpenFolderContainer } from "./open-folder-container";
import { Spinner } from "./spinner";
import styles from "./folder-element.module.scss";
import useSWR from "swr";
import { AnimatePresence, motion } from "framer-motion";
import { DirChildElem, Folder } from "./file-element";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import React, { useContext, useEffect, useState } from "react";

export const FolderElem: React.FC<
  DirChildElem & {
    mutateFunc: ReturnType<typeof useSWR<Folder, Error>>["mutate"];
  }
> = (props) => {
  const [rightClicked, setRightClicked] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, isLoading, error, mutate } = useSWR(
    isOpen ? "/api/" + props.currentPath + props.name : null
  );

  const {
    clicked,
    setClicked,
    setPosition,
    openFolder,
    setOpenFolder,
    setMutateFunc,
    rightClickElem,
    setRightClickElem,
  } = useContext(Context);

  //TO listen context open folder and change this component isOpen status
  useEffect(() => {
    if (openFolder === props.currentPath + props.name && !isOpen)
      setIsOpen(true);
    else if (openFolder.includes(props.name) && isOpen) setIsOpen(true);
    else if (openFolder !== props.currentPath + props.name && isOpen)
      setIsOpen(false);
    return;
  }, [openFolder, props, isOpen, setIsOpen]);

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
    return;
  }, [rightClickElem, setRightClicked, props]);

  const handleClick = (): void => {
    setClicked(true);
    if (!isOpen) {
      setIsOpen(true);
      setOpenFolder(props.currentPath + props.name);
    }
    if (isOpen) {
      setIsOpen(false);
      setOpenFolder(props.currentPath);
    }
  };

  return (
    <motion.div
      className={!isOpen ? `${styles.folder}` : `${styles.folder} open`}
      initial={{ paddingLeft: 10 }}
      animate={{ paddingLeft: 0 }}
      exit={{ paddingLeft: 10 }}
      transition={{ duration: 0.2, ease: "easeIn" }}>
      <p
        onClick={handleClick}
        onContextMenu={(e) => {
          if (clicked) setClicked(false);
          setPosition({ pageX: e.pageX, pageY: e.pageY });
          setMutateFunc(() => props.mutateFunc);
          setRightClickElem(props);
        }}
        title={isOpen ? "关闭文件夹" : "打开文件夹"}
        // style={
        //   rightClicked
        //     ? { backgroundColor: "#e9e9e9", outline: "1px solid #e0e0e0" }
        //     : {}
        // }
        className={!rightClicked ? "name" : "name selected"}>
        {isLoading ? (
          <span>
            <Spinner />
          </span>
        ) : (
          <span>
            {isOpen && <FcOpenedFolder />}
            {!isOpen && <FcFolder />}
          </span>
        )}
        {props.name}
      </p>
      {error && isOpen && <>{"Error Fetch Data"}</>}
      {
        <AnimatePresence>
          {data && isOpen && (
            <motion.div
              initial={{
                opacity: 0,
                maxHeight: 0,
              }}
              animate={{
                maxHeight: 5000,
                opacity: 1,
              }}
              exit={{
                maxHeight: 0,
                opacity: 0,
              }}
              transition={{ duration: 0.2, ease: "easeInOut" }}>
              <OpenFolderContainer elems={JSON.parse(data).childElem} mutateFunc={mutate} />
            </motion.div>
          )}
        </AnimatePresence>
      }
    </motion.div>
  );
};
