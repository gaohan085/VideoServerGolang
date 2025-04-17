"use client";

import { FcSynchronize } from "react-icons/fc";
import styles from "./spinner.module.scss";

const Spinner: React.FC<Readonly<{ fontSize?: number, cssStyles?: Record<string, string> }>> = ({
  fontSize, cssStyles
}) => {
  return (
    <span
      className={styles.spinner}
      style={{
        fontSize: fontSize,
        width: fontSize,
        height: fontSize,
        maxWidth: fontSize,
        ...cssStyles
      }}
    >
      <FcSynchronize />
    </span>
  );
};

export default Spinner;