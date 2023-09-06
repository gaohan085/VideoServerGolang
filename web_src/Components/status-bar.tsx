import React from "react";
import styles from "./status-bar.module.scss";
import useSWR from "swr";
import { FcDataProtection, FcRightUp, FcTreeStructure } from "react-icons/fc";

type DiskSpace = {
  diskPath: string;
  free: number;
  size: number;
};

const DiskUsage: React.FC = () => {
  // const { data, isLoading, error } = useSWR<DiskSpace, Error>("/api/disk");
  const data: DiskSpace = {
      diskPath: "/",
      free: 1024,
      size: 10240,
    },
    error: Error = null,
    isLoading = false;
  return (
    <p>
      {error ? (
        "Error Fetch Data"
      ) : isLoading ? (
        "Loading"
      ) : (
        <>
          <FcDataProtection />{" "}
          <>{`剩余磁盘空间: ${(data.free / (1024 * 1024 * 1024)).toFixed(
            1
          )} GB`}</>
        </>
      )}
    </p>
  );
};

const GitCommit: React.FC = () => {
  const { data, isLoading, error } = useSWR<string, Error>("/api/git");
  return (
    <>
      <p>
        {isLoading ? (
          <></>
        ) : error ? (
          <>{"Error"}</>
        ) : (
          <>
            <FcTreeStructure /> <>{`Git仓库提交版本: ${data}`}</>
          </>
        )}
      </p>
    </>
  );
};

export const StatusBar: React.FC = () => {
  return (
    <div className={styles.statusBar}>
      <div>
        <DiskUsage />
        <GitCommit />
        <p>
          <FcRightUp />{" "}
          <a href='http://192.168.1.11/qbittorrent' target='_blank'>
            {"Qbittorrent"}
          </a>
        </p>
      </div>
    </div>
  );
};
