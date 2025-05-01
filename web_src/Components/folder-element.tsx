"use client";

import { lazy, Suspense, useContext, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import Context from "./file-sys-context.ts";
import styles from "./folder-element.module.scss";
import RenameElement from "./rename-element.tsx";
import Spinner from "./spinner.tsx";
import type { DirElement } from "./types.d.ts";

const LazyErrElement = lazy(() => import("./error-element.tsx"));
const LazyContainer = lazy(() => import("./container-element.tsx"));

const LoadingFileElement: React.FC<{ elem: DirElement }> = (props) => {
  const { elem } = props;

  return (
    <a className="folder-element">
      <Spinner />
      {elem.name}
    </a>
  );
};

type FolderElementProps = Readonly<{
  elem: DirElement;
  isOpen: boolean;
  handleClick: React.MouseEventHandler;
  handleCtxMenu: React.MouseEventHandler;
  isRename: boolean;
}>;

const FolderElement: React.FC<FolderElementProps> = (props) => {
  const {
    elem,
    isOpen,
    handleClick,
    handleCtxMenu,
    isRename,
  } = props;

  return (
    <div className={styles.folder}>
      <ErrorBoundary fallback={<LazyErrElement />}>
        <Suspense fallback={<LoadingFileElement elem={elem} />}>
          <a
            className="folder-element"
            onClick={handleClick}
            onContextMenu={handleCtxMenu}
            title={isOpen ? "收起文件夹" : "打开文件夹"}
          >
            <span>{isOpen ? <FcOpenedFolder /> : <FcFolder />}</span>
            {!isRename && elem.name}
            {!!isRename && <RenameElement {...elem} />}
          </a>
          <LazyContainer elem={elem} isOpen={isOpen} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

const InteractiveFolderElement: React.FC<{
  readonly elem: DirElement;
}> = ({ elem }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  // TO listen context open folder and change this component isOpen status
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
      // 取消其他正在重命名的元素
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

      // 取消其他正在重命名的元素
      setRenameElement!(undefined);
    }
  };

  return (
    <FolderElement
      elem={elem}
      isOpen={isOpen}
      handleClick={handleClick}
      handleCtxMenu={handleCtxMenu}
      isRename={isRename}
    />
  );
};

export default InteractiveFolderElement;
