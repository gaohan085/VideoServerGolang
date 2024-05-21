import axios from "axios";
import React, { useContext, useState } from "react";
import {
  FcEmptyTrash,
  FcFolder,
  FcOpenedFolder,
  FcProcess,
  FcServices,
  FcStart,
} from "react-icons/fc";

import * as lib from "../lib";

import * as styles from "./right-click-context-menu.module.scss";

import { Context, type DirElement } from ".";

const PlayVideo: React.FC = () => {
  return (
    <a>
      <span>
        <FcStart />
      </span>
      播放视频
    </a>
  );
};

const OpenFolder: React.FC = () => {
  return (
    <a>
      <span>
        <FcOpenedFolder />
      </span>
      打开文件夹
    </a>
  );
};

const CloseFolder: React.FC = () => {
  return (
    <a>
      <span>
        <FcFolder />
      </span>
      收起文件夹
    </a>
  );
};

const ProcessVideo: React.FC = () => {
  return (
    <a>
      <span>
        <FcProcess />
      </span>
      转换视频
    </a>
  );
};

const Delete: React.FC<{ readonly isFile: boolean }> = (props) => {
  const { isFile } = props;
  return (
    <a>
      <span>
        <FcEmptyTrash />
      </span>

      {isFile ? "删除文件" : "删除文件夹"}
    </a>
  );
};

const Rename: React.FC = () => {
  return (
    <a>
      <span>
        <FcServices />
      </span>
      重命名
    </a>
  );
};

const DeleteConfirm: React.FC<{
  readonly elem: DirElement;
  readonly handleConfirmDel: React.MouseEventHandler;
  readonly handleCancelDel: React.MouseEventHandler;
  readonly position: { pageX: number; pageY: number };
}> = (props) => {
  const { elem, handleConfirmDel, handleCancelDel, position } = props;

  return (
    <div
      className={styles["ctx-dialog"]}
      style={{ top: position.pageY, left: position.pageX }}
    >
      <p>{`确认删除${elem.isFile ? "文件" : "文件夹"} "${elem.name}"`}</p>

      <div>
        <p onClick={handleCancelDel}>取消</p>

        <p onClick={handleConfirmDel}>确认</p>
      </div>
    </div>
  );
};

const CtxMenu: React.FC<{
  /* 右键点击的元素 */
  readonly elem: DirElement;
  readonly openFolder: string;
  readonly handleOpenFolder: React.MouseEventHandler;
  readonly handleCloseFolder: React.MouseEventHandler;
  readonly handleConverVideo?: React.MouseEventHandler;
  readonly handleDelete: React.MouseEventHandler;
  readonly handlePlayVideo: React.MouseEventHandler;
  readonly position: { pageX: number; pageY: number };
  readonly handleRename: React.MouseEventHandler;
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
    handleRename,
  } = props;

  return (
    <div
      className={styles.ctx}
      style={{ top: position.pageY, left: position.pageX }}
    >
      <ul>
        {/* First list */}
        {!!elem.isFile && lib.isVideo(elem.extName) && (
          <li onClick={handlePlayVideo}>
            <PlayVideo />
          </li>
        )}

        {!!elem.isFolder &&
          !openFolder.includes(elem.currentPath + elem.name) && (
            <li onClick={handleOpenFolder}>
              <OpenFolder />
            </li>
          )}

        {!!elem.isFolder &&
          openFolder.includes(elem.currentPath + elem.name) && (
            <li onClick={handleCloseFolder}>
              <CloseFolder />
            </li>
          )}

        {/* Second list */}
        {!!elem.isFile && lib.isVideo(elem.extName) && (
          <li onClick={handleConverVideo}>
            <ProcessVideo />
          </li>
        )}

        {/* RENAME */}
        <li onClick={handleRename}>
          <Rename />
        </li>

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
    setRenameElement,
  } = useContext(Context);

  const dispatch = lib.redux.useAppDispatch();

  const handleOpenFolder: React.MouseEventHandler = () => {
    setOpenFolder!(
      rightClickElem && rightClickElem.currentPath + rightClickElem.name,
    );
    setClicked!(true);
  };
  const handleCloseFolder: React.MouseEventHandler = () => {
    setOpenFolder!(rightClickElem ? rightClickElem.currentPath : "");
    setClicked!(true);
  };

  const handleDelete: React.MouseEventHandler = () => {
    setDelConfirm(true);
  };

  const handlePlayVideo: React.MouseEventHandler = () => {
    dispatch(lib.redux.setVideoPlaying(rightClickElem!));
    setClicked!(true);
  };

  const handleCancelDel: React.MouseEventHandler = () => {
    setDelConfirm(false);
    setClicked!(true);
  };

  const handleConfirmDel: React.MouseEventHandler = () => {
    void axios.post("/api/delete", rightClickElem).then(() => {
      const { currentPath } = rightClickElem!;
      void mutateFunc!(currentPath === "" ? "/api" : `/api/${currentPath}`);
      setClicked!(true);
    });
  };

  const handleConvertVideo: React.MouseEventHandler = () => {
    void axios.post("/api/convert", rightClickElem).then(() => {
      setClicked!(true);
      const { currentPath } = rightClickElem!;
      void mutateFunc!(currentPath === "" ? "/api" : `/api/${currentPath}`)
    })
  };

  const handleRename: React.MouseEventHandler = () => {
    setClicked!(true);
    setRenameElement!(rightClickElem);
  };

  return (
    <>
      {!delConfirm && (
        <CtxMenu
          elem={rightClickElem!}
          handleCloseFolder={handleCloseFolder}
          handleConverVideo={handleConvertVideo}
          handleDelete={handleDelete}
          handleOpenFolder={handleOpenFolder}
          handlePlayVideo={handlePlayVideo}
          handleRename={handleRename}
          openFolder={openFolder!}
          position={position!}
        />
      )}

      {!!delConfirm && (
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
