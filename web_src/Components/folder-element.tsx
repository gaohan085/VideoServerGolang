import { AnimatePresence, motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import useSWR from "swr";

import styles from "./folder-element.module.scss";

import {
  Context,
  ErrorElement,
  type DirElement,
  InteractiveOpenFolderContainer,
  Spinner,
} from ".";

export interface DirectoryProp {
  parentFolder: string; //relative path
  currentPath: string; //relative path
  childElements: DirElement[];
}

const FolderElement: React.FC<
  Pick<DirElement, "name"> & {
    isLoading: boolean | undefined;
    isOpen: boolean | undefined;
    isError: boolean | undefined;
    handleClick: React.MouseEventHandler | undefined;
    handleCtxMenu: React.MouseEventHandler | undefined;
    subDirectoryData: DirectoryProp | undefined;
    mutateFunc: ReturnType<typeof useSWR<DirectoryProp, Error>>["mutate"];
  }
> = (props) => {
  const {
    name,
    isLoading,
    isOpen,
    isError,
    handleClick,
    handleCtxMenu,
    subDirectoryData,
    mutateFunc,
  } = props;

  const ConditionalFolderIcon = (
    <>{isLoading ? <Spinner /> : isOpen ? <FcOpenedFolder /> : <FcFolder />}</>
  );

  return (
    <motion.div
      className={!isOpen ? `${styles.folder}` : `${styles.folder} open`}
      initial={{ paddingLeft: 12 }}
      animate={{ paddingLeft: 0 }}
      exit={{ paddingLeft: 12 }}
      transition={{ duration: 0.2, ease: "easeIn" }}
    >
      <p
        onClick={handleClick}
        onContextMenu={handleCtxMenu}
        className="folder-element"
      >
        <span>{ConditionalFolderIcon}</span>
        {name}
      </p>
      {isError && <ErrorElement />}
      <AnimatePresence>
        {isOpen && subDirectoryData && (
          <motion.div
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{ maxHeight: 5000, opacity: 1 }}
            exit={{ maxHeight: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            style={{ borderLeft: "1px solid #2c2842", marginLeft: "8px" }}
          >
            <InteractiveOpenFolderContainer
              data={subDirectoryData}
              mutateFunc={mutateFunc}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const InteractiveFolderElement: React.FC<
  DirElement & {
    mutateFunc: ReturnType<typeof useSWR<DirectoryProp, Error>>["mutate"];
  }
> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, isLoading, error, mutate } = useSWR<DirectoryProp, Error>(
    isOpen
      ? encodeURI(
          "/api/" +
            (props.currentPath === "/" ? "" : props.currentPath) +
            props.name,
        )
      : null,
  );

  const {
    openFolder,
    setOpenFolder,
    setPosition,
    clicked,
    setClicked,
    setRightClickElem,
    setMutateFunc,
  } = useContext(Context);

  //TO listen context open folder and change this component isOpen status
  useEffect(() => {
    if (openFolder === props.currentPath + props.name && !isOpen)
      setIsOpen(true);
    else if (openFolder?.includes(props.name) && isOpen) setIsOpen(true);
    else if (openFolder !== props.currentPath + props.name && isOpen)
      setIsOpen(false);
    return;
  }, [openFolder, props, isOpen, setIsOpen]);

  const handleClick: React.MouseEventHandler = (): void => {
    setClicked && setClicked(true);
    if (!isOpen) {
      setIsOpen(true);
      setOpenFolder && setOpenFolder(props.currentPath + props.name);
    }
    if (isOpen) {
      setIsOpen(false);
      setOpenFolder && setOpenFolder(props.currentPath);
    }
  };

  const handleCtxMenu: React.MouseEventHandler = (e): void => {
    setPosition && setPosition({ ...e });
    clicked && setClicked && setClicked(false);
    setRightClickElem && setRightClickElem(props);
    setMutateFunc && setMutateFunc(() => props.mutateFunc);
  };

  return (
    <FolderElement
      {...props}
      isError={error ? true : false}
      isLoading={isLoading}
      isOpen={isOpen}
      handleClick={handleClick}
      handleCtxMenu={handleCtxMenu}
      subDirectoryData={data}
      mutateFunc={mutate}
    />
  );
};
