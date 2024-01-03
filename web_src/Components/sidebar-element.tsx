import React, { createContext, useEffect, useState } from "react";
import { FcPrevious } from "react-icons/fc";
import useSWR from "swr";

import { useWindowDimension } from "../lib";

import styles from "./sidebar-element.module.scss";

import {
  DirElement,
  DiskUsage,
  ErrorElement,
  InteractiveCtxMenu,
  InteractiveOpenFolderContainer,
  Spinner,
  type UseStateReturnType,
  type DirectoryProp,
  type InterfaceMutateFunc,
} from ".";

export const Sidebar: React.FC<{
  readonly data: DirectoryProp | undefined;
  readonly isLoading: boolean | undefined;
  readonly isError: boolean | undefined;
  readonly handleClick: React.MouseEventHandler;
  readonly handleCtxMenu: React.MouseEventHandler;
  readonly mutateFunc: InterfaceMutateFunc;
  readonly isActive: boolean | undefined;
  readonly toggleActive: React.MouseEventHandler;
  readonly width: number;
}> = (props) => {
  const {
    data,
    isLoading,
    isError,
    handleClick,
    handleCtxMenu,
    isActive,
    toggleActive,
    width,
    mutateFunc,
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
  );
};

export const Context = createContext<{
  clicked?: UseStateReturnType<boolean>[0];
  setClicked?: UseStateReturnType<boolean>[1];
  position?: UseStateReturnType<{ pageX: number; pageY: number }>[0];
  setPosition?: UseStateReturnType<{ pageX: number; pageY: number }>[1];
  openFolder?: UseStateReturnType<string>[0];
  setOpenFolder?: UseStateReturnType<string>[1];
  mutateFunc?: UseStateReturnType<InterfaceMutateFunc>[0];
  setMutateFunc?: UseStateReturnType<InterfaceMutateFunc>[1];
  rightClickElem?: UseStateReturnType<DirElement>[0];
  setRightClickElem?: UseStateReturnType<DirElement>[1];
  renameElement?: UseStateReturnType<DirElement>[0];
  setRenameElement?: UseStateReturnType<DirElement>[1];
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
    useState<
      ReturnType<
        typeof useSWR<{ statusCode: number; data: DirectoryProp }, Error>
      >["mutate"]
    >();

  const { data, isLoading, error, mutate } = useSWR<
    { statusCode: number; data: DirectoryProp },
    Error
  >("/api/");

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
        mutateFunc,
        setMutateFunc,
        renameElement,
        setRenameElement,
      }}
    >
      <Sidebar
        data={data?.data}
        handleClick={handleClick}
        handleCtxMenu={handleCtxMenu}
        isActive={isActive}
        isError={!error ? false : true}
        isLoading={isLoading}
        mutateFunc={mutate}
        toggleActive={toggleActive}
        width={width}
      />

      {!clicked && <InteractiveCtxMenu />}
    </Context.Provider>
  );
};
