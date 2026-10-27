"use client";

import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FcFolder, FcOpenedFolder } from "react-icons/fc";
import useBoundStore from "../../lib/zustand-store.ts";
import Spinner from "../spinner.tsx";
import type { RespElement } from "../types.d.ts";
import styles from "./folder-element.module.scss";
import InteractiveTsRenameComponent from "./rename-element-tanstack-form.tsx";
import { FsElementProptertiesClass } from "../../lib/element-properties.ts";

const LazyErrElement = lazy(() => import("./error-element.tsx"));
const LazyContainer = lazy(() => import("./container-element.tsx"));

const LoadingFileElement = ({ elem }: Readonly<{ elem: RespElement }>) => {
  return (
    <a className="folder-element">
      <Spinner />
      {elem.name}
    </a>
  );
};

type FolderElementProps = Readonly<{
  elem: RespElement;
  isOpen: boolean;
  handleClick: React.MouseEventHandler;
  handleCtxMenu: React.MouseEventHandler;
  isRename: boolean;
  cwd:string
}>;

const FolderElement = (props: FolderElementProps) => {
  const { elem, isOpen, handleClick, handleCtxMenu, isRename, cwd } = props;

  return (
    <div className={styles.folder}>
      <Suspense fallback={<LoadingFileElement elem={elem} />}>
        <a
          className="folder-element"
          onClick={handleClick}
          onContextMenu={handleCtxMenu}
          title={isOpen ? "收起文件夹" : "打开文件夹"}
        >
          <span>{isOpen ? <FcOpenedFolder /> : <FcFolder />}</span>
          {!isRename && elem.name}
          {!!isRename && <InteractiveTsRenameComponent elem={elem} cwd={cwd} />}
        </a>
        <ErrorBoundary fallback={<LazyErrElement />} onError={(error, info) => {
          console.log(error, info);
        }}>
          <LazyContainer elem={{name:elem.name, cwd:cwd + elem.name + "/"}} isOpen={isOpen} />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
};

const InteractiveFolderElement = ({ elem , cwd }: Readonly<{elem: RespElement, cwd:string }>) => {

  const {
    openFolderPath,
    setOpenFolderPath,
    setPosition,
    isClicked,
    setIsClicked,
    setRClickElem,
    renameElem,
    unSetRenameElem,
  } = useBoundStore((state) => state);

  const properties = new FsElementProptertiesClass(elem, cwd);

  const isRename = renameElem.path === properties.cwd && renameElem.name === properties.name;
  const layer = properties.cwd.split("/").filter(Boolean).length;
  const isOpen = openFolderPath.split("/").filter(Boolean)[layer] === properties.name;

  const handleClick: React.MouseEventHandler = (): void => {
    setIsClicked(true);
    if (!isRename) {
      if (!isOpen) {
        setOpenFolderPath(properties.cwd + properties.name);
      }
      if (isOpen) {
        setOpenFolderPath(properties.cwd);
      }
      // 取消其他正在重命名的元素
      unSetRenameElem();
    }
  };

  const handleCtxMenu: React.MouseEventHandler = (e): void => {
    if (!isRename) {
      setPosition({ pageX: e.pageX, pageY: e.pageY });
      isClicked && setIsClicked(false);
      setRClickElem!({path: properties.cwd,...elem});

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
      cwd={cwd}
    />
  );
};

export default InteractiveFolderElement;
