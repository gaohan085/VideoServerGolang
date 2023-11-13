import React, { createContext, useEffect, useState } from "react";
import { FcPrevious } from "react-icons/fc";
import useSWR from "swr";

import { useWindowDimension } from "../lib";

import { ErrorElement } from "./error-element";
import { type DirectoryProp } from "./folder-element";
import styles from "./sidebar-element.module.scss";

import {
  DirElement,
  DiskUsage,
  InteractiveCtxMenu,
  InteractiveOpenFolderContainer,
  Spinner,
} from ".";

export const Sidebar: React.FC<{
  data: DirectoryProp | undefined;
  isLoading: boolean | undefined;
  isError: boolean | undefined;
  handleClick: React.MouseEventHandler;
  handleCtxMenu: React.MouseEventHandler;
  mutateFunc: ReturnType<typeof useSWR<DirectoryProp, Error>>["mutate"];
  isActive: boolean | undefined;
  toggleActive: React.MouseEventHandler;
  width: number;
}> = (props) => {
  const {
    data,
    isLoading,
    isError,
    handleClick,
    handleCtxMenu,
    mutateFunc,
    isActive,
    toggleActive,
    width,
  } = props;

  const conditionalElem = (
    <>
      {isLoading ? (
        <Spinner fontSize={24} />
      ) : isError ? (
        <ErrorElement />
      ) : (
        data && (
          <InteractiveOpenFolderContainer data={data} mutateFunc={mutateFunc} />
        )
      )}
    </>
  );

  return (
    <div
      className={!isActive ? styles.sidebar : `${styles.sidebar} active`}
      onClick={handleClick}
      onContextMenu={handleCtxMenu}
    >
      <span onClick={toggleActive} className="arrow">
        <FcPrevious />
      </span>
      {isActive ? (
        <>
          <div className={"file-system"}>{conditionalElem}</div>
          {width <= 992 ? <DiskUsage /> : <></>}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export const Context = createContext<{
  clicked?: ReturnType<typeof useState<boolean>>[0];
  setClicked?: ReturnType<typeof useState<boolean>>[1];
  position?: ReturnType<typeof useState<{ pageX: number; pageY: number }>>[0];
  setPosition?: ReturnType<
    typeof useState<{ pageX: number; pageY: number }>
  >[1];
  openFolder?: ReturnType<typeof useState<string>>[0];
  setOpenFolder?: ReturnType<typeof useState<string>>[1];
  mutateFunc?: ReturnType<
    typeof useState<ReturnType<typeof useSWR<DirectoryProp, Error>>["mutate"]>
  >[0];
  setMutateFunc?: ReturnType<
    typeof useState<ReturnType<typeof useSWR<DirectoryProp, Error>>["mutate"]>
  >[1];
  rightClickElem?: ReturnType<typeof useState<DirElement>>[0];
  setRightClickElem?: ReturnType<typeof useState<DirElement>>[1];
}>({});

export const InteractiveSidebar: React.FC = () => {
  const [rightClickElem, setRightClickElem] = useState<DirElement | undefined>(
    undefined,
  );
  const [clicked, setClicked] = useState<boolean>(true);
  const [position, setPosition] = useState<
    { pageX: number; pageY: number } | undefined
  >(undefined);
  const [openFolder, setOpenFolder] = useState<string>("/");
  const [mutateFunc, setMutateFunc] =
    useState<ReturnType<typeof useSWR<DirectoryProp, Error>>["mutate"]>();

  const { data, isLoading, error, mutate } = useSWR<DirectoryProp, Error>(
    "/api/",
  );

  const handleClick: React.MouseEventHandler = () => {
    setClicked && setClicked(true);
  };
  const handleCtxMenu: React.MouseEventHandler = (e) => {
    e.preventDefault();
  };

  const [isActive, setIsActive] = useState<boolean>(false);
  const toggleActive: React.MouseEventHandler = () => setIsActive(!isActive);

  const { width } = useWindowDimension();

  useEffect(() => {
    if (width >= 992) setIsActive(true);
  }, [width, isActive, setIsActive]);

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
        mutateFunc,
        setMutateFunc,
      }}
    >
      <Sidebar
        handleClick={handleClick}
        handleCtxMenu={handleCtxMenu}
        data={data}
        isLoading={isLoading}
        isError={error ? true : false}
        mutateFunc={mutate}
        isActive={isActive}
        toggleActive={toggleActive}
        width={width}
      />
      {!clicked && <InteractiveCtxMenu />}
    </Context.Provider>
  );
};
