import React, { createContext, useState } from "react";
import useSWR, { useSWRConfig } from "swr";

import { useWindowDimension } from "../lib";

import styles from "./sidebar-file-system.module.scss";

import {
  DirElement,
  ErrorElement,
  InteractiveCtxMenu,
  InteractiveOpenFolderContainer,
  Spinner,
  type DirectoryProp,
  type UseStateReturnType,
} from ".";

const SideBarFileSys: React.FC<{
  readonly data: DirectoryProp | undefined;
  readonly isLoading: boolean | undefined;
  readonly isError: boolean | undefined;
  readonly handleClick: React.MouseEventHandler;
  readonly width: number;
  readonly handleCtxMenu: React.MouseEventHandler;
}> = (props) => {
  const { data, isLoading, isError, handleClick, handleCtxMenu } = props;

  const conditionalElem = (
    <>
      {isLoading ? (
        <Spinner fontSize={24} />
      ) : isError ? (
        <ErrorElement />
      ) : (
        data && <InteractiveOpenFolderContainer data={data} />
      )}
    </>
  );

  return (
    <>
      <div
        className={styles["file-system"]}
        onClick={handleClick}
        onContextMenu={handleCtxMenu}
      >
        {conditionalElem}
      </div>
    </>
  );
};

export const Context = createContext<{
  clicked?: UseStateReturnType<boolean>[0];
  setClicked?: UseStateReturnType<boolean>[1];
  position?: UseStateReturnType<{ pageX: number; pageY: number }>[0];
  setPosition?: UseStateReturnType<{ pageX: number; pageY: number }>[1];
  openFolder?: UseStateReturnType<string>[0];
  setOpenFolder?: UseStateReturnType<string>[1];
  rightClickElem?: UseStateReturnType<DirElement>[0];
  setRightClickElem?: UseStateReturnType<DirElement>[1];
  renameElement?: UseStateReturnType<DirElement>[0];
  setRenameElement?: UseStateReturnType<DirElement>[1];
  mutateFunc?: ReturnType<typeof useSWRConfig>["mutate"];
}>({});

export const InteractiveSideBarFileSys: React.FC = () => {
  const [rightClickElem, setRightClickElem] = useState<DirElement | undefined>(
    undefined,
  );
  const [clicked, setClicked] = useState<boolean>(true);
  const [position, setPosition] = useState<
    { pageX: number; pageY: number } | undefined
  >(undefined);
  const [openFolder, setOpenFolder] = useState<string>("/");

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

  const { width } = useWindowDimension();

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
      <SideBarFileSys
        data={data?.data}
        handleClick={handleClick}
        handleCtxMenu={handleCtxMenu}
        isError={!error ? false : true}
        isLoading={isLoading}
        width={width}
      />
      {!clicked && <InteractiveCtxMenu />}
    </Context.Provider>
  );
};
