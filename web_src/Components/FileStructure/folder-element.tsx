"use client";

import { lazy, Suspense, useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import useBoundStore from "../../lib/zustand-store.ts";
import Spinner from "../spinner.tsx";
import type { DirElement } from "../types.d.ts";
import styles from "./folder-element.module.scss";
import RenameElement from "./rename-element-tanstack-form.tsx";

const LazyErrElement = lazy(() => import("./error-element.tsx"));
const LazyContainer = lazy(() => import("./container-element.tsx"));

const LoadingFileElement = ({ elem }: Readonly<{ elem: DirElement }>) => {
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
  const { elem, isOpen, handleClick, handleCtxMenu, isRename } = props;

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

const InteractiveFolderElement = ({ elem }: { readonly elem: DirElement }) => {

  const {
    openFolderPath,
    setOpenFolderPath,
    setPosition,
    isClicked,
    setIsClicked,
    setRClickElem,
    renameElem,
    setRenameElem,
    unSetRenameElem,
  } = useBoundStore((state) => state);

  const isOpen = openFolderPath.includes(elem.name);
  const isRename = renameElem === elem;

  const handleClick: React.MouseEventHandler = (): void => {
    setIsClicked(true);
    if (!isRename) {
      if (!isOpen) {
        setOpenFolderPath(elem.currentPath + "/" + elem.name);
      }
      if (isOpen) {
        setOpenFolderPath(elem.currentPath);
      }
      // 取消其他正在重命名的元素
      unSetRenameElem();
    }
  };

  const handleCtxMenu: React.MouseEventHandler = (e): void => {
    if (!isRename) {
      setPosition({ pageX: e.pageX, pageY: e.pageY });
      isClicked && setIsClicked(false);
      setRClickElem!(elem);

      // 取消其他正在重命名的元素
      unSetRenameElem();
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
