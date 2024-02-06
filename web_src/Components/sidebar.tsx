import React, { useEffect, useState } from "react";
import { FcPrevious } from "react-icons/fc";

import { useWindowDimension } from "../lib";

import styles from "./sidebar.module.scss";

import { DiskUsage } from ".";

const Sidebar: React.FC<{
  isActive: boolean;
  width: number;
  toggleActive: React.MouseEventHandler;
  children: React.ReactNode;
}> = (props) => {
  const { isActive, toggleActive, children, width } = props;
  return (
    <div className={!isActive ? styles.sidebar : `${styles.sidebar} active`}>
      <span className="arrow" onClick={toggleActive}>
        <FcPrevious />
      </span>
      {!!isActive && <>{children}</>}
      {width <= 992 && <DiskUsage />}
    </div>
  );
};

export const InteractiveSideBar: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  const { children } = props;
  const [isActive, setIsActive] = useState<boolean>(false);
  const toggleActive: React.MouseEventHandler = () => setIsActive(!isActive);

  const { width } = useWindowDimension();

  //监听窗口宽度
  useEffect(() => {
    if (width >= 992) setIsActive(true);
  }, [width, isActive, setIsActive]);

  return (
    <Sidebar isActive={isActive} width={width} toggleActive={toggleActive}>
      {children}
    </Sidebar>
  );
};
