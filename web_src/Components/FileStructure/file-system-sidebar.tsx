"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FcPrevious } from "react-icons/fc";
import { useSWRConfig } from "swr";
import useWindowDimension from "../../lib/useWindowDimension.ts";
import Spinner from "../spinner.tsx";
import { DiskUsage } from "../status-bar.tsx";
import type { DirElement } from "../types.js";
import CtxMenu from "./context-menu.tsx";
import Context from "./file-sys-context.ts";
import styles from "./file-system-sidebar.module.scss";

const LazyErrElement = lazy(() => import("./error-element.tsx"));
const LazyContainer = lazy(() => import("./container-element.tsx"));

const FileSysSideBar: React.FC<Readonly<{
  handleClick: React.MouseEventHandler;
  width: number;
  handleCtxMenu: React.MouseEventHandler;
  toggleActive: React.MouseEventHandler;
  isActive: boolean;
  clicked: boolean;
}>> = (props) => {
  const {
    handleClick,
    handleCtxMenu,
    isActive,
    toggleActive,
    width,
    clicked,
  } = props;

  return (
    <>
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
            <div className="file-system">
              <LazyContainer elem={{ name: "", currentPath: "" }} isOpen />
            </div>
            {width <= 992 && <DiskUsage />}
          </>
        )}
      </div>
      {!clicked && <CtxMenu />}
    </>
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

  const handleClick: React.MouseEventHandler = () => {
    setClicked(true);
  };
  const handleCtxMenu: React.MouseEventHandler = (e) => {
    e.preventDefault();
  };

  const [isActive, setIsActive] = useState<boolean>(false);
  const toggleActive: React.MouseEventHandler = () => setIsActive(!isActive);

  const { width } = useWindowDimension();

  // 监听窗口宽度
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
        mutate: mutate,
      }}
    >
      <ErrorBoundary fallback={<LazyErrElement />}>
        <Suspense fallback={
          (
            <div className={!isActive ? styles.fileSysSidebar : `${styles.fileSysSidebar} active`}>
              <div className="file-system">
                <Spinner fontSize={24} />
              </div>
            </div>
          )
        }
        >
          <FileSysSideBar
            handleClick={handleClick}
            handleCtxMenu={handleCtxMenu}
            isActive={isActive}
            clicked={clicked!}
            toggleActive={toggleActive}
            width={width}
          />
        </Suspense>
      </ErrorBoundary>
    </Context.Provider>
  );
};

export default InteractiveFileSysSideBar;
