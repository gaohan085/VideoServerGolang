import React from "react";
import { FcDataProtection, FcSearch } from "react-icons/fc";
import useSWR from "swr";
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
        {!!data && (
          <>
            {`剩余磁盘空间: ${(diskspace.free / (1024 * 1024 * 1024)).toFixed(
              1,
            )} GB`}
          </>
        )}
      </p>
    );
  }
};

const StatusBar: React.FC = () => {
  const { data, isLoading, error } = useSWR<
    { statusCode: number; data: string },
    Error
  >("/api/version");
  return (
    <div className={styles.statusBar}>
      <div>
        <DiskUsage />
        <p>
          <FcSearch />
          <>
            {" "}
            {!!isLoading && "Loading"}
            {!!error && "Error Load Data"}
            {!!data && `当前版本: ${data.data}`}
          </>
        </p>
      </div>
    </div>
  );
};

export default StatusBar;