import { OpenFolderContainer } from "./open-folder-container";
import { RightClickMenu } from "./right-click-menu";
import { Spinner } from "./spinner";
import styles from "./sidebar.module.scss";
import useSWR from "swr";
import { type DirChildElem, type Folder } from "./file-element";
import React, { createContext, useState } from "react";

export const Context = createContext<{
  clicked: ReturnType<typeof useState<boolean>>[0];
  setClicked: ReturnType<typeof useState<boolean>>[1];
  position: ReturnType<typeof useState<{ pageX: number; pageY: number }>>[0];
  setPosition: ReturnType<typeof useState<{ pageX: number; pageY: number }>>[1];
  openFolder: ReturnType<typeof useState<string>>[0];
  setOpenFolder: ReturnType<typeof useState<string>>[1];
  mutateFunc: ReturnType<
    typeof useState<ReturnType<typeof useSWR<Folder, Error>>["mutate"]>
  >[0];
  setMutateFunc: ReturnType<
    typeof useState<ReturnType<typeof useSWR<Folder, Error>>["mutate"]>
  >[1];
  rightClickElem: ReturnType<typeof useState<DirChildElem>>[0];
  setRightClickElem: ReturnType<typeof useState<DirChildElem>>[1];
}>(null);

export const SideBar: React.FC = () => {
  const [rightClickElem, setRightClickElem] = useState<DirChildElem>(null);
  const [clicked, setClicked] = useState<boolean>(true);
  const [position, setPosition] = useState<{ pageX: number; pageY: number }>(
    null
  );
  const [openFolder, setOpenFolder] = useState<string>("/");
  const [mutateFunc, setMutateFunc] =
    useState<ReturnType<typeof useSWR<Folder, Error>>["mutate"]>();

  const { data, isLoading, error, mutate } = useSWR("/api/");

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
            setRightClickElem(null);
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
                elems={JSON.parse(data).childElem}
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
