import { AnimatePresence, motion } from "framer-motion";
import React, { useContext, useEffect, useState } from "react";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import useSWR from "swr";

import * as styles from "./folder-element.module.scss";

import {
  Context,
  ErrorElement,
  InteractiveOpenFolderContainer,
  InteractiveRenameComponent,
  Spinner,
  type DirElement,
  type DirectoryProp,
} from ".";

const FolderElement: React.FC<{
  readonly elem: DirElement;
  readonly isLoading: boolean | undefined;
  readonly isOpen: boolean | undefined;
  readonly isError: boolean | undefined;
  readonly handleClick: React.MouseEventHandler | undefined;
  readonly handleCtxMenu: React.MouseEventHandler | undefined;
  readonly subDirectoryData: DirectoryProp | undefined;
  readonly isRename: boolean;
}> = (props) => {
  const {
    elem,
    isLoading,
    isOpen,
    isError,
    handleClick,
    handleCtxMenu,
    subDirectoryData,
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
      animate={{ paddingLeft: 0 }}
      className={!isOpen ? `${styles.folder}` : `${styles.folder} open`}
      exit={{ paddingLeft: 12 }}
      initial={{ paddingLeft: 12 }}
      transition={{ duration: 0.2, ease: "easeIn" }}
    >
      <a
        className="folder-element"
        onClick={handleClick}
        onContextMenu={handleCtxMenu}
        title={isOpen ? "收起文件夹" : "打开文件夹"}
      >
        {ConditionalFolderIcon}
        {!isRename && elem.name}
        {!!isRename && <InteractiveRenameComponent {...elem} />}
      </a>
      {!!isError && <ErrorElement />}
      <AnimatePresence>
        {!!isOpen && !!subDirectoryData && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ height: "calc-size(auto)", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ borderLeft: "1px solid #2c2842", marginLeft: "8px" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            id="animate"
          >
            <InteractiveOpenFolderContainer data={subDirectoryData} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const InteractiveFolderElement: React.FC<{
  readonly elem: DirElement;
}> = ({ elem }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, isLoading, error } = useSWR<
    { statusCode: number; data: DirectoryProp },
    Error
  >(
    isOpen
      ? elem.currentPath === ""
        ? `/api/${elem.name}`
        : `/api/${elem.currentPath}/${elem.name}`
      : null,
  );

  const {
    openFolder,
    setOpenFolder,
    setPosition,
    clicked,
    setClicked,
    setRightClickElem,
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
  }, [openFolder, elem, isOpen, setIsOpen]);

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

      //取消其他正在重命名的元素
      setRenameElement!(undefined);
    }
  };

  return (
    <FolderElement
      elem={elem}
      handleClick={handleClick}
      handleCtxMenu={handleCtxMenu}
      isError={error ? true : false}
      isLoading={isLoading}
      isOpen={isOpen}
      isRename={isRename}
      subDirectoryData={data?.data}
    />
  );
};
