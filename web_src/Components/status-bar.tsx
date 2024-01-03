import React from "react";
import useSWR from "swr";
import { FcDataProtection, FcRightUp } from "react-icons/fc";

import styles from "./status-bar.module.scss";

interface DiskSpace {
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
}

export const DiskUsage: React.FC = () => {
  const { data, isLoading, error } = useSWR<
    { statusCode: number; data: DiskSpace },
    Error
  >("/api/disk");

  if (error) return <>Error Fetch Data</>;
  if (isLoading) return <>Loading</>;
  if (data) {
    const { data: diskspace } = data;
    return (
      <p>
        <FcDataProtection />{" "}
        {data ? (
          <>
            {`剩余磁盘空间: ${(diskspace.free / (1024 * 1024 * 1024)).toFixed(
              1,
            )} GB`}
          </>
        ) : null}
      </p>
    );
  }
};

export const StatusBar: React.FC = () => {
  return (
    <div className={styles.statusBar}>
      <div>
        <DiskUsage />

        <p>
          <FcRightUp />{" "}
          <a
            href="http://192.168.1.11/qbittorrent"
            rel="noreferrer"
            target="_blank"
          >
            Qbittorrent
          </a>
        </p>
      </div>
    </div>
  );
};
