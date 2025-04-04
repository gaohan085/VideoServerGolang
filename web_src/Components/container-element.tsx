"use client";

import { AnimatePresence, motion } from "motion/react";
import React, { lazy } from "react";
import sortElements from "../lib/sort-elements-by-name";
import type { DirectoryProp } from "./types";

const LazyFileElement = lazy(() => import("./file-element"));
const LazyFolderElement = lazy(() => import("./folder-element"));

const Container: React.FC<Readonly<
  {
    subDirData: DirectoryProp | undefined,
    isOpen: boolean
  }
>> = (props) => {
  const { isOpen, subDirData } = props;

  return (
    <AnimatePresence>
      {!!isOpen && !!subDirData &&
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "max-content" }}
          exit={{ height: 0 }}
          transition={{ duration: .2, ease: "easeInOut" }}
          id="container"
        >
          {subDirData.childElements.sort((a, b) => sortElements(a, b)).map(
            (elem, index) => {
              if (elem.isFile) return (
                <motion.div
                  initial={{ opacity: 0, paddingLeft: "15px" }}
                  animate={{ opacity: 1, paddingLeft: "0px" }}
                  exit={{ opacity: 0, paddingLeft: "15px" }}
                  transition={{ duration: .3, ease: "easeInOut" }}
                  id="file-element-animator"
                  key={index}
                >
                  <LazyFileElement elem={elem} />
                </motion.div>
              );
              if (elem.isFolder) return (
                <motion.div
                  initial={{ opacity: 0, paddingLeft: "15px" }}
                  animate={{ opacity: 1, paddingLeft: "0px" }}
                  exit={{ opacity: 0, paddingLeft: "15px" }}
                  transition={{ duration: .3, ease: "easeInOut" }}
                  id="folder-element-animator"
                  key={index}
                >
                  <LazyFolderElement elem={elem} />
                </motion.div>
              );
            })}
        </motion.div>}
    </AnimatePresence>
  );
};

export default Container;