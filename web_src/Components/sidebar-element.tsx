import React, { createContext, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

import { ErrorElement } from "./error-element";
import { type DirectoryProp } from "./folder-element";
import styles from "./sidebar-element.module.scss";

import {
  DirElement,
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
}> = (props) => {
  const { data, isLoading, isError, handleClick, handleCtxMenu, mutateFunc } =
    props;

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
      className={styles.sidebar}
      onClick={handleClick}
      onContextMenu={handleCtxMenu}
    >
      <div className={"file-system"}>{conditionalElem}</div>
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

  const { data, isLoading, error } = useSWR<DirectoryProp, Error>("/api/");

  const handleClick: React.MouseEventHandler = () => {
    return;
  };
  const handleCtxMenu: React.MouseEventHandler = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    console.log(position);
  }, [position]);

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
      />
      {!clicked && <InteractiveCtxMenu />}
    </Context.Provider>
  );
};
