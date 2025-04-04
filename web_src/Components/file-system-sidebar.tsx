"use client";

import React, { lazy, Suspense, useEffect, useState } from "react";
import { FcPrevious } from "react-icons/fc";
import useSWR, { useSWRConfig } from "swr";
import useWindowDimension from "../lib/useWindowDimension";
import Context from "./file-sys-context";
import styles from "./file-system-sidebar.module.scss";
import Spinner from "./spinner";
import { DiskUsage } from "./status-bar";
import { type DirectoryProp, type DirElement } from "./types.d";

const LazyErrElement = lazy(() => import("./error-element"));
const LazyContainer = lazy(() => import("./container-element"));
const LazyCtxMenu = lazy(() => import("./context-menu"));

const FileSysSideBar: React.FC<Readonly<{
  data: DirectoryProp | undefined;
  isLoading: boolean | undefined;
  isError: boolean | undefined;
  handleClick: React.MouseEventHandler;
  width: number;
  handleCtxMenu: React.MouseEventHandler;
  toggleActive: React.MouseEventHandler;
  isActive: boolean;
  clicked: boolean;
}>> = (props) => {
  const {
    data,
    isLoading,
    isError,
    handleClick,
    handleCtxMenu,
    isActive,
    toggleActive,
    width,
    clicked
  } = props;

  const conditionalElem = (
    <>
      {!!isLoading && (<Spinner fontSize={24} />)}
      {!!isError && (<LazyErrElement />)}
      {!!data && (
        <LazyContainer subDirData={data} isOpen />
      )}
    </>
  );
  
  return (
    <Suspense fallback={
      (<div className={!isActive ? styles.fileSysSidebar : `${styles.fileSysSidebar} active`}>
        <div className="file-system">
          <Spinner fontSize={24} />
        </div>
      </div>)
    }>
      <div
        className={
          !isActive ? styles.fileSysSidebar : `${styles.fileSysSidebar} active`
        }
        onClick={handleClick}
        onContextMenu={handleCtxMenu}
      >
        <span className="arrow" onClick={toggleActive}>
          <FcPrevious />
        </span>

        {!!isActive && (
          <>
            <div className="file-system">{conditionalElem}</div>
            {width <= 992 && <DiskUsage />}
          </>
        )}
      </div>
      {!clicked && (
        <>
          <LazyCtxMenu />
        </>
      )}
    </Suspense>
  );
};

const InteractiveFileSysSideBar: React.FC = () => {
  const [rightClickElem, setRightClickElem] = useState<DirElement | undefined>(
    undefined,
  );
  const [clicked, setClicked] = useState<boolean | undefined>(true);
  const [position, setPosition] = useState<
    { pageX: number; pageY: number } | undefined
  >(undefined);
  const [openFolder, setOpenFolder] = useState<string | undefined>("/");

  const { mutate } = useSWRConfig();

  const { data, isLoading, error } = useSWR<
    { statusCode: number; data: DirectoryProp },
    Error
  >("/api");

  const handleClick: React.MouseEventHandler = () => {
    setClicked(true);
  };
  const handleCtxMenu: React.MouseEventHandler = (e) => {
    e.preventDefault();
  };

  const [isActive, setIsActive] = useState<boolean>(false);
  const toggleActive: React.MouseEventHandler = () => setIsActive(!isActive);

  const { width } = useWindowDimension();

  //监听窗口宽度
  useEffect(() => {
    if (width >= 992) setIsActive(true);
  }, [width, isActive, setIsActive]);

  const [renameElement, setRenameElement] = useState<DirElement | undefined>(
    undefined,
  );

  return (
    <Context.Provider
      value={{
        clicked,
        setClicked,
        rightClickElem,
        setRightClickElem,
        position,
        setPosition,
        openFolder,
        setOpenFolder,
        renameElement,
        setRenameElement,
        mutateFunc: mutate,
      }}
    >
      <FileSysSideBar
        data={data?.data}
        handleClick={handleClick}
        handleCtxMenu={handleCtxMenu}
        isError={!error ? false : true}
        isLoading={isLoading}
        width={width}
        toggleActive={toggleActive}
        isActive={isActive}
        clicked={clicked!}
      />
    </Context.Provider>
  );
};

export default InteractiveFileSysSideBar;