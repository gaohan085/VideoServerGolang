"use client";

import { lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import useBoundStore from "../../lib/zustand-store.ts";
import styles from "./file-system-sidebar.module.scss";

const LazyErrElement = lazy(() => import("./error-element.tsx"));
const LazyContainer = lazy(() => import("./container-element.tsx"));

const FileSysSideBar = (
  props: Readonly<{
    handleClick: React.MouseEventHandler;
    handleCtxMenu: React.MouseEventHandler;
    isSidebarActive: boolean;
  }>,
) => {
  const { handleClick, handleCtxMenu, isSidebarActive } = props;

  return (
    <>
      <div onClick={handleClick} onContextMenu={handleCtxMenu}>
        {!!isSidebarActive && (
          <div className={styles["file-system"]}>
            <LazyContainer elem={{ name: "", cwd: "/" }} isOpen />
          </div>
        )}
      </div>
    </>
  );
};

const InteractiveFileSysSideBar = () => {
  const {
    setIsClicked,
    isSidebarActive,
  } = useBoundStore((state) => state);

  const handleClick: React.MouseEventHandler = () => {
    setIsClicked(true);
  };
  const handleCtxMenu: React.MouseEventHandler = (e) => {
    e.preventDefault();
  };

  return (
    <ErrorBoundary fallback={<LazyErrElement />} onError={e => console.log(e)}>
      <FileSysSideBar
        handleClick={handleClick}
        handleCtxMenu={handleCtxMenu}
        isSidebarActive={isSidebarActive}
      />
    </ErrorBoundary>
  );
};

export default InteractiveFileSysSideBar;
