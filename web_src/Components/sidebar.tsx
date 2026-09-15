import { useEffect, type ReactNode } from "react";
import { FcPrevious } from "react-icons/fc";
import useWindowDimension from "../lib/useWindowDimension.ts";
import useBoundStore from "../lib/zustand-store.ts";
import styles from "./sidebar.module.scss";
import { DiskUsage } from "./status-bar.tsx";

const SideBar = ({ children }: { readonly children: ReactNode }) => {
  const { isSidebarActive, setSidebarStatus, toggleSidebarStatus } =
    useBoundStore((state) => state);

  const { width } = useWindowDimension();

  useEffect(() => {
    if (width > 992) setSidebarStatus(true);
    if (!isSidebarActive && width <= 992) setSidebarStatus(false);
  }, [width, isSidebarActive, setSidebarStatus]);

  return (
    <div
      className={
        !isSidebarActive ? styles["sidebar"] : `${styles["sidebar"]} open`
      }
    >
      <span className="top-arrow" onClick={() => toggleSidebarStatus()}>
        <FcPrevious onAnimationEnd={()=>{}}/>
      </span>
      {!!isSidebarActive && (
        <>
          <div className="middle">{children}</div>
          {width <= 992 && (
            <div className="statusbar">
              <DiskUsage />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SideBar;
