import React, { lazy, useContext, useEffect, useRef, useState } from "react";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import useSWR from "swr";
import { CSSTransition } from "react-transition-group";
import * as styles from "./folder-element.module.scss";
import { Context } from "./file-system-sidebar";
import Spinner from "./spinner";
import OpenFolderContainer from "./open-folder-container-element";
import type { DirectoryProp, DirElement } from "./types";

const LazyErrElement = lazy(()=>import("./error-element"));
const LazyRenameElement = lazy(()=>import("./rename-element"));

const FolderElement: React.FC<{
  readonly elem: DirElement;
  readonly isLoading: boolean | undefined;
  readonly isOpen: boolean;
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

  const nodeRef = useRef(null);

  return (
    <div
      className={!isOpen ? `${styles.folder}` : `${styles.folder} open`}
    >
      <a
        className="folder-element"
        onClick={handleClick}
        onContextMenu={handleCtxMenu}
        title={isOpen ? "收起文件夹" : "打开文件夹"}
      >
        {ConditionalFolderIcon}
        {!isRename && elem.name}
        {!!isRename && <LazyRenameElement {...elem} />}
      </a>
      {!!isError && <LazyErrElement />}
      <CSSTransition
        in={!!isOpen && !!subDirectoryData}
        unmountOnExit
        classNames={{
          enter: styles["container-enter"],
          enterActive: styles["container-enter-active"],
          exit: styles["container-exit"],
          exitActive: styles["container-exit-active"]
        }}
        timeout={300}
        nodeRef={nodeRef}
      >
        <OpenFolderContainer data={subDirectoryData!} isOpen={isOpen} ref={nodeRef} />
      </CSSTransition>
    </div>
  );
};

const InteractiveFolderElement: React.FC<{
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

export default InteractiveFolderElement;