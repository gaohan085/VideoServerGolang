"use client";

import { AnimatePresence, m } from "motion/react";
import { Fragment, lazy } from "react";
import useSWR from "swr";
import sortElements from "../../lib/sort-elements-by-name.ts";
import type { DirElement, RespElement } from "../types.js";

const LazyFileElement = lazy(() => import("./file-element.tsx"));
const LazyFolderElement = lazy(() => import("./folder-element.tsx"));

const Container = ({
  elem,
  isOpen,
}: Readonly<{
  elem: Pick<DirElement, "name" | "cwd">;
  isOpen: boolean;
}>) => {
  const { cwd } = elem;
  const { data } = useSWR<{ code: number; data: RespElement[] }>(
    isOpen
      ? `/api${cwd}`
      : null,
  );

  return (
    <AnimatePresence>
      {!!isOpen && (
        <m.div
          initial={{ height: 0 }}
          animate={{ height: "max-content" }}
          exit={{ height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          id="container"
        >
          {data!.data
            .sort((a, b) => sortElements(a, b))
            .map((elem, index) => (
              <Fragment key={index}>
                {elem.type === "file" && (
                  <m.div
                    initial={{ opacity: 0, paddingLeft: "10px" }}
                    animate={{ opacity: 1, paddingLeft: "0px" }}
                    exit={{ opacity: 0, paddingLeft: "10px" }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    id="file-element-animator"
                    key={index}
                  >
                    <LazyFileElement elem={elem} cwd={cwd} />
                  </m.div>
                )}
                {elem.type === "directory" && (
                  <m.div
                    initial={{ opacity: 0, paddingLeft: "10px" }}
                    animate={{ opacity: 1, paddingLeft: "0px" }}
                    exit={{ opacity: 0, paddingLeft: "10px" }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    id="folder-element-animator"
                    key={index}
                  >
                    <LazyFolderElement elem={elem} cwd={cwd} />
                  </m.div>
                )}
              </Fragment>
            ))}
        </m.div>
      )}
    </AnimatePresence>
  );
};

export default Container;
