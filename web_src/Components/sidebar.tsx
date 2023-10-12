import { OpenFolderContainer } from "./open-folder-container";
import { RightClickMenu } from "./right-click-menu";
import { Spinner } from "./spinner";
import styles from "./sidebar.module.scss";
import useSWR from "swr";
import { type DirChildElem, type Folder } from "./file-element";
import React, { createContext, useState } from "react";

export const Context = createContext<{
  clicked: ReturnType<typeof useState<boolean>>[0] | undefined;
  setClicked: ReturnType<typeof useState<boolean>>[1] | undefined;
  position:
    | ReturnType<typeof useState<{ pageX: number; pageY: number }>>[0]
    | undefined;
  setPosition:
    | ReturnType<typeof useState<{ pageX: number; pageY: number }>>[1]
    | undefined;
  openFolder: ReturnType<typeof useState<string>>[0] | undefined;
  setOpenFolder: ReturnType<typeof useState<string>>[1] | undefined;
  mutateFunc:
    | ReturnType<
        typeof useState<ReturnType<typeof useSWR<Folder, Error>>["mutate"]>
      >[0]
    | undefined;
  setMutateFunc:
    | ReturnType<
        typeof useState<ReturnType<typeof useSWR<Folder, Error>>["mutate"]>
      >[1]
    | undefined;
  rightClickElem: ReturnType<typeof useState<DirChildElem>>[0] | undefined;
  setRightClickElem: ReturnType<typeof useState<DirChildElem>>[1] | undefined;
}>({
  clicked: undefined,
  setClicked: undefined,
  position: undefined,
  setPosition: undefined,
  openFolder: undefined,
  setOpenFolder: undefined,
  mutateFunc: undefined,
  setMutateFunc: undefined,
  rightClickElem: undefined,
  setRightClickElem: undefined,
});

export const SideBar: React.FC = () => {
  const [rightClickElem, setRightClickElem] = useState<
    DirChildElem | undefined
  >(undefined);
  const [clicked, setClicked] = useState<boolean>(true);
  const [position, setPosition] = useState<
    | {
        pageX: number;
        pageY: number;
      }
    | undefined
  >(undefined);
  const [openFolder, setOpenFolder] = useState<string>("/");
  const [mutateFunc, setMutateFunc] =
    useState<ReturnType<typeof useSWR<Folder, Error>>["mutate"]>();

  const { data, isLoading, error, mutate } = useSWR<Folder, Error>("/api/");

  return (
    <Context.Provider
      value={{
        clicked,
        setClicked,
        position,
        setPosition,
        openFolder,
        setOpenFolder,
        mutateFunc,
        setMutateFunc,
        rightClickElem,
        setRightClickElem,
      }}>
      <>
        <div
          className={styles.sideBar}
          onClick={() => {
            setClicked(true);
            setRightClickElem(undefined);
          }}
          onContextMenu={(e) => e.preventDefault()}>
          <div className={styles.fileSys}>
            {isLoading && (
              <div style={{ margin: "auto" }}>
                <Spinner fontSize={24} />
              </div>
            )}
            {error && <div>Error Get Data</div>}
            {data && (
              <OpenFolderContainer
                elems={data.childElements}
                mutateFunc={mutate}
              />
            )}
          </div>
        </div>
        {!clicked && <RightClickMenu />}
      </>
    </Context.Provider>
  );
};
