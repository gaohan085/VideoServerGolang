"use client";

import axios from "axios";
import { useState } from "react";
import {
  FcEmptyTrash,
  FcFolder,
  FcOpenedFolder,
  FcProcess,
  FcServices,
  FcStart,
} from "react-icons/fc";
import isVideo from "../../lib/is-video.ts";
import useBoundStore from "../../lib/zustand-store.ts";
import type { DirElement } from "../types.d.ts";
import styles from "./context-menu.module.scss";

const PlayVideo = () => {
  return (
    <a>
      <span>
        <FcStart />
      </span>
      {"播放视频"}
    </a>
  );
};

const OpenFolder = () => {
  return (
    <a>
      <span>
        <FcOpenedFolder />
      </span>
      {"打开文件夹"}
    </a>
  );
};

const CloseFolder = () => {
  return (
    <a>
      <span>
        <FcFolder />
      </span>
      {"收起文件夹"}
    </a>
  );
};

const ProcessVideo = () => {
  return (
    <a>
      <span>
        <FcProcess />
      </span>
      {"转换视频"}
    </a>
  );
};

const Delete = ({ isFile }: Readonly<{ isFile: boolean }>) => {
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
      {"重命名"}
    </a>
  );
};

const DeleteConfirm = (props: {
  readonly elem: DirElement;
  readonly handleConfirmDel: React.MouseEventHandler;
  readonly handleCancelDel: React.MouseEventHandler;
  readonly position: { pageX: number; pageY: number };
}) => {
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

const CtxMenu = (
  props: Readonly<{
    /* 右键点击的元素 */
    elem: DirElement;
    openFolderPath: string;
    handleOpenFolder: React.MouseEventHandler;
    handleCloseFolder: React.MouseEventHandler;
    handleConverVideo?: React.MouseEventHandler;
    handleDelete: React.MouseEventHandler;
    handlePlayVideo: React.MouseEventHandler;
    position: { pageX: number; pageY: number };
    handleRename: React.MouseEventHandler;
  }>,
) => {
  const {
    elem,
    openFolderPath,
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
        {!!elem.isFile && isVideo(elem.extName) && (
          <li onClick={handlePlayVideo}>
            <PlayVideo />
          </li>
        )}

        {!!elem.isFolder && !openFolderPath.includes(elem.currentPath +"/" + elem.name) && (
          <li onClick={handleOpenFolder}>
            <OpenFolder />
          </li>
        )}

        {!!elem.isFolder && !!openFolderPath.includes(elem.currentPath +"/" + elem.name) && (
          <>
            <li onClick={handleCloseFolder}>
              <CloseFolder />
            </li>
          </>
        )}

        {/* Second list */}
        {!!elem.isFile && isVideo(elem.extName) && (
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

const InteractiveCtxMenu = () => {
  const [delConfirm, setDelConfirm] = useState<boolean>(false);
  const {
    rClickElem,
    position,
    setOpenFolderPath,
    setIsClicked,
    openFolderPath,
    mutate,
    setRenameElem,
    setVideoPlaying,
  } = useBoundStore((state) => state);

  const handleOpenFolder: React.MouseEventHandler = () => {
    setOpenFolderPath(rClickElem && rClickElem.currentPath + "/" + rClickElem.name);
    setIsClicked(true);
  };
  const handleCloseFolder: React.MouseEventHandler = () => {
    setOpenFolderPath(rClickElem ? rClickElem.currentPath : "");
    setIsClicked(true);
  };

  const handleDelete: React.MouseEventHandler = () => {
    setDelConfirm(true);
  };

  const handlePlayVideo: React.MouseEventHandler = () => {
    setVideoPlaying(rClickElem);
    setIsClicked(true);
  };

  const handleCancelDel: React.MouseEventHandler = () => {
    setDelConfirm(false);
    setIsClicked(true);
  };

  const handleConfirmDel: React.MouseEventHandler = () => {
    void axios.post("/api/delete", rClickElem).then(() => {
      const { currentPath } = rClickElem!;
      void mutate!(`/api/${currentPath}`);
      setIsClicked(true);
    });
  };

  const handleConvertVideo: React.MouseEventHandler = () => {
    void axios.post("/api/convert", rClickElem).then(() => {
      setIsClicked(true);
      const { currentPath } = rClickElem;
      void mutate!(`/api/${currentPath}`);
    });
  };

  const handleRename: React.MouseEventHandler = () => {
    setIsClicked(true);
    setRenameElem(rClickElem);
  };

  return (
    <>
      {!delConfirm && (
        <CtxMenu
          elem={rClickElem}
          handleCloseFolder={handleCloseFolder}
          handleConverVideo={handleConvertVideo}
          handleDelete={handleDelete}
          handleOpenFolder={handleOpenFolder}
          handlePlayVideo={handlePlayVideo}
          handleRename={handleRename}
          openFolderPath={openFolderPath}
          position={position!}
        />
      )}

      {!!delConfirm && (
        <DeleteConfirm
          elem={rClickElem}
          handleCancelDel={handleCancelDel}
          handleConfirmDel={handleConfirmDel}
          position={position}
        />
      )}
    </>
  );
};

export default InteractiveCtxMenu;
