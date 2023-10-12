import axios from "axios";
import { Context } from "./sidebar";
// import isVideo from "../../lib/isVideo";
import styles from "./right-click-menu.module.scss";
import {
  FcClapperboard,
  FcEmptyTrash,
  FcOpenedFolder,
  FcProcess,
} from "react-icons/fc";
import React, { useContext, useState } from "react";
import { setPlaySource, useAppDispatch } from "../lib/reduxStore";

export const RightClickMenu: React.FC = () => {
  const {
    setClicked,
    position,
    openFolder,
    setOpenFolder,
    mutateFunc,
    rightClickElem,
  } = useContext(Context);
  const dispatch = useAppDispatch();
  const [onDel, setOnDel] = useState<boolean>(false);

  return (
    <>
      {onDel && (
        <div
          className={styles["ctx-dialog"]}
          style={{ top: position?.pageY, left: position?.pageX }}>
          <p>{"确认删除"}</p>
          <div>
            <p onClick={() => setClicked && setClicked(true)}>{"取消"}</p>
            <p
              onClick={() => {
                setClicked && setClicked(true);
                void axios.post("/api/delete", rightClickElem).then(() => {
                  mutateFunc && void mutateFunc();
                });
              }}>
              {"确认"}
            </p>
          </div>
        </div>
      )}
      {!onDel && (
        <div
          className={styles.ctx}
          style={{ top: position?.pageY, left: position?.pageX }}
          onContextMenu={(e) => {
            e.preventDefault();
          }}>
          <ul>
            {rightClickElem?.isFile /**&& isVideo(rightClickElem.extName) */ && (
              <>
                {rightClickElem.extName === ".mp4" && (
                  <li
                    onClick={() => {
                      setClicked && setClicked(true);
                      dispatch(setPlaySource(rightClickElem.playSrc!));
                    }}>
                    <p>
                      <span>
                        <FcClapperboard />
                      </span>
                      {"播放视频"}
                    </p>
                  </li>
                )}
                <li
                  onClick={() => {
                    setClicked && setClicked(true);
                    //TODO covert video backend point
                    return;
                  }}>
                  <p>
                    <span>
                      <FcProcess />
                    </span>
                    {"转换视频"}
                  </p>
                </li>
              </>
            )}
            {rightClickElem?.isFolder &&
              !openFolder?.includes(
                rightClickElem.currentPath + rightClickElem.name
              ) && (
                <li
                  onClick={() => {
                    setOpenFolder &&
                      setOpenFolder(
                        rightClickElem.currentPath + rightClickElem.name
                      );
                    setClicked && setClicked(true);
                  }}>
                  <p>
                    <span>
                      <FcOpenedFolder />
                    </span>
                    {"打开文件夹"}
                  </p>
                </li>
              )}
            {rightClickElem?.isFolder &&
              openFolder?.includes(
                rightClickElem.currentPath + rightClickElem.name
              ) && (
                <li
                  onClick={() => {
                    setOpenFolder && setOpenFolder(rightClickElem.currentPath);
                    setClicked && setClicked(true);
                  }}>
                  <p>
                    <span>
                      <FcOpenedFolder />
                    </span>
                    {"收起文件夹"}
                  </p>
                </li>
              )}
            <li
              onClick={() => {
                setOnDel(true);
              }}>
              <p>
                <span>
                  <FcEmptyTrash />
                </span>
                {rightClickElem?.isFolder ? "删除文件夹" : "删除文件"}
              </p>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};
