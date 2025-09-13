"use client";

import { AnimatePresence, m } from "motion/react";
import { lazy } from "react";
import useSWR from "swr";
import sortElements from "../../lib/sort-elements-by-name.ts";
import type { DirectoryProp, DirElement } from "../types.js";

const LazyFileElement = lazy(() => import("./file-element.tsx"));
const LazyFolderElement = lazy(() => import("./folder-element.tsx"));

const Container: React.FC<Readonly<
  {
    elem: Pick<DirElement, "name" | "currentPath">;
    isOpen: boolean;
  }
>> = (props) => {
  const { isOpen, elem } = props;

  const { data } = useSWR<
    { statusCode: number; data: DirectoryProp }
  >(
    isOpen
      ? elem.currentPath === ""
        ? `/api/${elem.name}`
        : `/api/${elem.currentPath}/${elem.name}`
      : null,
  );

  return (
    <AnimatePresence>
      {!!isOpen
        && (
          <m.div
            initial={{ height: 0 }}
            animate={{ height: "max-content" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            id="container"
          >
            {data?.data.childElements.sort((a, b) => sortElements(a, b)).map(
              (elem, index) => {
                if (elem.isFile) return (
                  <m.div
                    initial={{ opacity: 0, paddingLeft: "15px" }}
                    animate={{ opacity: 1, paddingLeft: "0px" }}
                    exit={{ opacity: 0, paddingLeft: "15px" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    id="file-element-animator"
                    key={index}
                  >
                    <LazyFileElement elem={elem} />
                  </m.div>
                );
                if (elem.isFolder) return (
                  <m.div
                    initial={{ opacity: 0, paddingLeft: "15px" }}
                    animate={{ opacity: 1, paddingLeft: "0px" }}
                    exit={{ opacity: 0, paddingLeft: "15px" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    id="folder-element-animator"
                    key={index}
                  >
                    <LazyFolderElement elem={elem} />
                  </m.div>
                );
              })}
          </m.div>
        )}
    </AnimatePresence>
  );
};

export default Container;
