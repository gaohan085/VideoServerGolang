import axios from "axios";
import React, { useContext, useState } from "react";
import {
  FcClapperboard,
  FcEmptyTrash,
  FcFolder,
  FcOpenedFolder,
  FcProcess,
} from "react-icons/fc";

import * as lib from "../lib";

import styles from "./right-click-context-menu.module.scss";

import { Context, type DirElement } from ".";

const PlayVideo: React.FC = () => {
  return (
    <p>
      <span>
        <FcClapperboard />
      </span>
      {"播放视频"}
    </p>
  );
};

const OpenFolder: React.FC = () => {
  return (
    <p>
      <span>
        <FcOpenedFolder />
      </span>
      {"打开文件夹"}
    </p>
  );
};

const CloseFolder: React.FC = () => {
  return (
    <p>
      <span>
        <FcFolder />
      </span>
      {"收起文件夹"}
    </p>
  );
};

const ProcessVideo: React.FC = () => {
  return (
    <p>
      <span>
        <FcProcess />
      </span>
      {"转换视频"}
    </p>
  );
};

const Delete: React.FC<{ isFile: boolean }> = (props) => {
  const { isFile } = props;
  return (
    <p>
      <span>
        <FcEmptyTrash />
      </span>
      {isFile ? "删除文件" : "删除文件夹"}
    </p>
  );
};

const DeleteConfirm: React.FC<{
  elem: DirElement;
  handleConfirmDel: React.MouseEventHandler;
  handleCancelDel: React.MouseEventHandler;
  position: { pageX: number; pageY: number };
}> = (props) => {
  const { elem, handleConfirmDel, handleCancelDel, position } = props;

  return (
    <div
      className={styles["ctx-dialog"]}
      style={{ top: position.pageY, left: position.pageX }}
    >
      <p>{`确认删除${elem.isFile ? "文件" : "文件夹"} "${elem.name}"`}</p>
      <div>
        <p onClick={handleCancelDel}>{"取消"}</p>
        <p onClick={handleConfirmDel}>{"确认"}</p>
      </div>
    </div>
  );
};

const CtxMenu: React.FC<{
  /* 右键点击的元素 */
  elem: DirElement;
  openFolder: string;
  handleOpenFolder: React.MouseEventHandler;
  handleCloseFolder: React.MouseEventHandler;
  handleConverVideo?: React.MouseEventHandler;
  handleDelete: React.MouseEventHandler;
  handlePlayVideo: React.MouseEventHandler;
  position: { pageX: number; pageY: number };
}> = (props) => {
  const {
    elem,
    openFolder,
    handleOpenFolder,
    handleCloseFolder,
    handleDelete,
    handleConverVideo,
    handlePlayVideo,
    position,
  } = props;

  return (
    <div
      className={styles.ctx}
      style={{ top: position.pageY, left: position.pageX }}
    >
      <ul>
        {/* First list */}
        {elem.isFile && lib.isVideo(elem.extName) && (
          <li onClick={handlePlayVideo}>
            <PlayVideo />
          </li>
        )}
        {elem.isFolder &&
          !openFolder.includes(elem.currentPath + elem.name) && (
            <li onClick={handleOpenFolder}>
              <OpenFolder />
            </li>
          )}
        {elem.isFolder && openFolder.includes(elem.currentPath + elem.name) && (
          <li onClick={handleCloseFolder}>
            <CloseFolder />
          </li>
        )}

        {/* Second list */}
        {elem.isFile && lib.isVideo(elem.extName) && (
          <li onClick={handleConverVideo}>
            <ProcessVideo />
          </li>
        )}

        {/* Last list */}
        <li onClick={handleDelete}>
          <Delete isFile={elem.isFile} />
        </li>
      </ul>
    </div>
  );
};

export const InteractiveCtxMenu: React.FC = () => {
  const [delConfirm, setDelConfirm] = useState<boolean>(false);
  const {
    rightClickElem,
    position,
    setOpenFolder,
    setClicked,
    openFolder,
    mutateFunc,
  } = useContext(Context);

  const dispatch = lib.redux.useAppDispatch();

  const handleOpenFolder: React.MouseEventHandler = () => {
    setOpenFolder &&
      setOpenFolder(
        rightClickElem && rightClickElem.currentPath + rightClickElem.name,
      );
    setClicked && setClicked(true);
  };
  const handleCloseFolder: React.MouseEventHandler = () => {
    setOpenFolder &&
      setOpenFolder(rightClickElem ? rightClickElem.currentPath : "");

    setClicked && setClicked(true);
  };

  const handleDelete: React.MouseEventHandler = () => {
    setDelConfirm(true);
  };

  const handlePlayVideo: React.MouseEventHandler = () => {
    dispatch(
      lib.redux.setPlaySource(rightClickElem ? rightClickElem.playSrc! : ""),
    );
    setClicked && setClicked(true);
  };

  const handleCancelDel: React.MouseEventHandler = () => {
    setDelConfirm(false);
    setClicked && setClicked(true);
  };

  const handleConfirmDel: React.MouseEventHandler = () => {
    void axios.post("/api/delete", rightClickElem).then(() => {
      mutateFunc && void mutateFunc();
      setClicked && setClicked(true);
    });
  };

  const handleConvertVideo: React.MouseEventHandler = () => {
    setClicked && setClicked(true);

    //TODO POST Convert video
  };

  return (
    <>
      {!delConfirm && (
        <CtxMenu
          elem={rightClickElem!}
          position={position!}
          handleOpenFolder={handleOpenFolder}
          handleCloseFolder={handleCloseFolder}
          handleDelete={handleDelete}
          handlePlayVideo={handlePlayVideo}
          handleConverVideo={handleConvertVideo}
          openFolder={openFolder!}
        />
      )}
      {delConfirm && (
        <DeleteConfirm
          elem={rightClickElem!}
          handleCancelDel={handleCancelDel}
          handleConfirmDel={handleConfirmDel}
          position={position!}
        />
      )}
    </>
  );
};
