import React from "react";
import { FcDataProtection, FcSearch } from "react-icons/fc";
import useSWR from "swr";
import styles from "./status-bar.module.scss";

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
  const { data } = useSWR<
    { statusCode: number; data: DiskSpace },
    Error
  >("/api/diskusage");


  const { data: diskspace } = data!;
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
};

const StatusBar: React.FC = () => {
  const { data } = useSWR<
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
            {`当前版本: ${data?.data}`}
          </>
        </p>
      </div>
    </div>
  );
};

export { DiskUsage };
export default StatusBar;