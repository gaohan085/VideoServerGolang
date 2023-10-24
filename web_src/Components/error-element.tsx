import { FcCancel } from "react-icons/fc";
import { motion } from "framer-motion";
import React from "react";

import styles from "./error-element.module.scss";

export const ErrorElement: React.FC = () => {
  return (
    <motion.p
      className={styles["error-element"]}
      initial={{ paddingLeft: 8 }}
      animate={{ paddingLeft: 0 }}
      exit={{ paddingLeft: 8 }}
      transition={{ duration: 0.2, ease: "easeIn" }}
    >
      <span>
        <FcCancel />
      </span>
      {"Error Fetch Data"}
    </motion.p>
  );
};
