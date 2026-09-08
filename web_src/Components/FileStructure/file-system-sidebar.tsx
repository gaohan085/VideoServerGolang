"use client";

import { lazy, useState, Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useSWRConfig } from "swr";
import useBoundStore from "../../lib/zustand-store.ts";
import Spinner from "../spinner.tsx";
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
            <LazyContainer elem={{ name: "", currentPath: "" }} isOpen />
          </div>
        )}
      </div>
    </>
  );
};

const InteractiveFileSysSideBar = () => {
  const {
    setMutate,
    setIsClicked,
    isSidebarActive,
  } = useBoundStore((state) => state);

  const { mutate } = useSWRConfig();
  useEffect(()=>{
    setMutate(mutate);
  }, [mutate, setMutate]);


  const handleClick: React.MouseEventHandler = () => {
    setIsClicked(true);
  };
  const handleCtxMenu: React.MouseEventHandler = (e) => {
    e.preventDefault();
  };

  return (
    <ErrorBoundary fallback={<LazyErrElement />}>
      <Suspense
        fallback={
          <div
            className={
              !isSidebarActive
                ? styles.fileSysSidebar
                : `${styles.fileSysSidebar} active`
            }
          >
            <div className="file-system">
              <Spinner fontSize={24} />
            </div>
          </div>
        }
      >
        <FileSysSideBar
          handleClick={handleClick}
          handleCtxMenu={handleCtxMenu}
          isSidebarActive={isSidebarActive}
        />
      </Suspense>
    </ErrorBoundary>
  );
};

export default InteractiveFileSysSideBar;
