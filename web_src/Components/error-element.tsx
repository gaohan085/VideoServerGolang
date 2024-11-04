import { FcCancel } from "react-icons/fc";
import { motion } from "framer-motion";
import React from "react";

import * as styles from "./error-element.module.scss";

const ErrorElement: React.FC = () => {
  return (
    <motion.p
      animate={{ paddingLeft: 0 }}
      className={styles["error-element"]}
      exit={{ paddingLeft: 8 }}
      initial={{ paddingLeft: 8 }}
      transition={{ duration: 0.2, ease: "easeIn" }}
    >
      <span>
        <FcCancel />
      </span>
      Error Fetch Data
    </motion.p>
  );
};

export default ErrorElement;