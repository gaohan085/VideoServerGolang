import { FcSynchronize } from "react-icons/fc";
import React from "react";

import styles from "./spinner.module.scss";

export const Spinner: React.FC<{ readonly fontSize?: number }> = (props) => {
  return (
    <span
      className={styles.spinner}
      style={{
        fontSize: props.fontSize,
        width: props.fontSize,
        height: props.fontSize,
      }}
    >
      <FcSynchronize />
    </span>
  );
};
