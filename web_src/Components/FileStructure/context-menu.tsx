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
import { FsElementProptertiesClass } from "../../lib/element-properties.ts";
import isVideo from "../../lib/is-video.ts";
import useBoundStore from "../../lib/zustand-store.ts";
import styles from "./context-menu.module.scss";
import { useSWRConfig } from "swr";

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
  readonly elem: FsElementProptertiesClass;
  readonly handleConfirmDel: React.MouseEventHandler;
  readonly handleCancelDel: React.MouseEventHandler;
  readonly position: { pageX: number; pageY: number };
}) => {
  const { elem, handleConfirmDel, handleCancelDel, position } = props;

  return (
    <div
      className={styles["ctx-dialog"]}
      style={{ top: position.pageY, left: position.pageX }}
      onContextMenu={ (e) => e.preventDefault()}
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
    properties: FsElementProptertiesClass;
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
    properties,
    openFolderPath,
    handleOpenFolder,
    handleCloseFolder,
    handleDelete,
    handleConverVideo,
    handlePlayVideo,
    position,
    handleRename,
  } = props;

  const layer = properties.cwd.split("/").filter(Boolean).length;
  const rClickFolderisOpen = openFolderPath.split("/").filter(Boolean)[layer] === properties.name;

  return (
    <div
      className={styles.ctx}
      style={{ top: position.pageY, left: position.pageX }}
      onContextMenu={ (e) => e.preventDefault()}
    >
      <ul>
        {/* First list */}
        {!!properties.isFile && properties.isVideo && (
          <li onClick={handlePlayVideo}>
            <PlayVideo />
          </li>
        )}

        {!!properties.isFolder && !rClickFolderisOpen && (
          <li onClick={handleOpenFolder}>
            <OpenFolder />
          </li>
        )}

        {!!properties.isFolder && !!rClickFolderisOpen && (
          <>
            <li onClick={handleCloseFolder}>
              <CloseFolder />
            </li>
          </>
        )}

        {/* Second list */}
        {!!properties.isFile && isVideo(properties.extName) && (
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
          <Delete isFile={properties.isFile} />
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
    setRenameElem,
    setVideoPlaying,
  } = useBoundStore((state) => state);

  const { mutate } = useSWRConfig();

  const properties = new FsElementProptertiesClass({...rClickElem}, rClickElem.path);

  const handleOpenFolder: React.MouseEventHandler = () => {
    setOpenFolderPath(rClickElem && rClickElem.path + "/" + rClickElem.name);
    setIsClicked(true);
  };
  const handleCloseFolder: React.MouseEventHandler = () => {
    setOpenFolderPath(rClickElem ? rClickElem.path : "");
    setIsClicked(true);
  };

  const handleDelete: React.MouseEventHandler = () => {
    setDelConfirm(true);
  };

  const handlePlayVideo: React.MouseEventHandler = () => {
    setVideoPlaying({playSrc:properties.playSrc, name:properties.playSrc, sn:properties.sn,});
    setIsClicked(true);
  };

  const handleCancelDel: React.MouseEventHandler = () => {
    setDelConfirm(false);
    setIsClicked(true);
  };

  const handleConfirmDel: React.MouseEventHandler = () => {
    void axios.post("/api/delete", rClickElem).then(() => {
      const { path } = rClickElem!;
      void mutate!(`/api${path}`);
      setIsClicked(true);
    }).catch();
  };

  const handleConvertVideo: React.MouseEventHandler = () => {
    void axios.post("/api/convert", rClickElem).then(() => {
      setIsClicked(true);
      const { path } = rClickElem;

      void mutate!(`/api/${path}`);
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
          properties={properties}
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
          elem={properties}
          handleCancelDel={handleCancelDel}
          handleConfirmDel={handleConfirmDel}
          position={position}
        />
      )}
    </>
  );
};

export default InteractiveCtxMenu;
