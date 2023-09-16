import React from "react";
import styles from "./status-bar.module.scss";
import useSWR from "swr";
import { FcDataProtection, FcRightUp } from "react-icons/fc";

type DiskSpace = {
  path: string;
  fstype: string;
  total: number;
  free: number;
  used: number;
  usedPercent: number;
  inodesTotal: number;
  inodesUsed: number;
  inodesFree: number;
  inodesUsedPercent: number;
};

const DiskUsage: React.FC = () => {
  const { data, isLoading, error } = useSWR<DiskSpace, Error>("/api/disk");
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

export const StatusBar: React.FC = () => {
  return (
    <div className={styles.statusBar}>
      <div>
        <DiskUsage />
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
