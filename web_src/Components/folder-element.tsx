import { AnimatePresence, motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import useSWR from "swr";

import styles from "./folder-element.module.scss";

import {
  Context,
  ErrorElement,
  InteractiveOpenFolderContainer,
  InteractiveRenameComponent,
  Spinner,
  type DirElement,
  type DirectoryProp,
  type InterfaceMutateFunc,
} from ".";

const FolderElement: React.FC<{
  elem: DirElement;
  isLoading: boolean | undefined;
  isOpen: boolean | undefined;
  isError: boolean | undefined;
  handleClick: React.MouseEventHandler | undefined;
  handleCtxMenu: React.MouseEventHandler | undefined;
  subDirectoryData: DirectoryProp | undefined;
  mutateFunc: InterfaceMutateFunc;
  isRename: boolean;
}> = (props) => {
  const {
    elem,
    isLoading,
    isOpen,
    isError,
    handleClick,
    handleCtxMenu,
    subDirectoryData,
    mutateFunc,
    isRename,
  } = props;

  const ConditionalFolderIcon = (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <span>{isOpen ? <FcOpenedFolder /> : <FcFolder />}</span>
      )}
    </>
  );

  return (
    <motion.div
      className={!isOpen ? `${styles.folder}` : `${styles.folder} open`}
      initial={{ paddingLeft: 12 }}
      animate={{ paddingLeft: 0 }}
      exit={{ paddingLeft: 12 }}
      transition={{ duration: 0.2, ease: "easeIn" }}
    >
      <a
        onClick={handleClick}
        onContextMenu={handleCtxMenu}
        className="folder-element"
      >
        {ConditionalFolderIcon}
        {!isRename && elem.name}
        {isRename && <InteractiveRenameComponent {...elem} />}
      </a>
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

export const InteractiveFolderElement: React.FC<{
  elem: DirElement;
  mutateFunc: InterfaceMutateFunc;
}> = (props) => {
  const { elem, mutateFunc } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, isLoading, error, mutate } = useSWR<{ statusCode: number, data: DirectoryProp }, Error>(
    isOpen
      ? encodeURI(
        "/api/" +
        (elem.currentPath === "/" ? "" : elem.currentPath) +
        elem.name,
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
    renameElement,
    setRenameElement,
  } = useContext(Context);

  //TO listen context open folder and change this component isOpen status
  useEffect(() => {
    if (openFolder === elem.currentPath + elem.name && !isOpen) setIsOpen(true);
    else if (openFolder?.includes(elem.name) && isOpen) setIsOpen(true);
    else if (openFolder !== elem.currentPath + elem.name && isOpen)
      setIsOpen(false);
    return;
  }, [openFolder, props, isOpen, setIsOpen]);

  const handleClick: React.MouseEventHandler = (): void => {
    setClicked!(true);
    if (!isRename) {
      if (!isOpen) {
        setIsOpen(true);
        setOpenFolder!(elem.currentPath + elem.name);
      }
      if (isOpen) {
        setIsOpen(false);
        setOpenFolder!(elem.currentPath);
      }
      //取消其他正在重命名的元素
      setRenameElement!(undefined);
    }
  };

  const [isRename, setIsRename] = useState<boolean>(false);
  useEffect(() => {
    elem === renameElement ? setIsRename(true) : setIsRename(false);
    return;
  }, [elem, renameElement, setIsRename]);

  const handleCtxMenu: React.MouseEventHandler = (e): void => {
    if (!isRename) {
      setPosition!({ ...e });
      clicked && setClicked!(false);
      setRightClickElem!(elem);
      setMutateFunc!(() => mutateFunc);
      //取消其他正在重命名的元素
      setRenameElement!(undefined);
    }
  };

  return (
    <FolderElement
      elem={elem}
      isError={error ? true : false}
      isLoading={isLoading}
      isOpen={isOpen}
      handleClick={handleClick}
      handleCtxMenu={handleCtxMenu}
      subDirectoryData={data?.data}
      mutateFunc={mutate}
      isRename={isRename}
    />
  );
};
