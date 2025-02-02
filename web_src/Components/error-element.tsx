import React from "react";
import { FcCancel } from "react-icons/fc";
import * as styles from "./error-element.module.scss";

const ErrorElement: React.FC = () => {
  return (
    <p
      className={styles["error-element"]}
    >
      <span>
        <FcCancel />
      </span>
      Error Fetch Data
    </p>
  );
};

export default ErrorElement;