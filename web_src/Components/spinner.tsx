import { FcSynchronize } from "react-icons/fc";
import React from "react";

import * as  styles from "./spinner.module.scss";

export const Spinner: React.FC<{ readonly fontSize?: number }> = ({
  fontSize,
}) => {
  return (
    <span
      className={styles.spinner}
      style={{
        fontSize: fontSize,
        width: fontSize,
        height: fontSize,
      }}
    >
      <FcSynchronize />
    </span>
  );
};
