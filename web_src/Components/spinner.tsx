import { FcSynchronize } from "react-icons/fc";
import React from "react";

import * as styles from "./spinner.module.scss";

export const Spinner: React.FC<{ readonly fontSize?: number, readonly cssStyles?: Record<string, string> }> = ({
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
