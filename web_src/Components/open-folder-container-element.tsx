import React, { forwardRef, lazy, type LegacyRef } from "react";
import * as lib from "../lib";
import type { DirectoryProp } from "./types";

const LazyFileElement = lazy(() => import("./file-element"));
const LazyFolderElement = lazy(() => import("./folder-element"));


export const InteractiveOpenFolderContainer = forwardRef(function Container(
  props: { data: DirectoryProp, isOpen: boolean }, ref: LegacyRef<HTMLDivElement>
) {
  const { data, isOpen } = props;
  console.log(data);
  return (
    !!isOpen && <div id="open-folder-container" ref={ref}>
      {data.childElements
        .sort((a, b) => lib.sortElements(a, b))
        .map((elem, index) => {
          return elem.isFile ? (
            <LazyFileElement elem={elem} key={index} />
          ) : (
            <LazyFolderElement elem={elem} key={index} />
          );
        })}
    </div>);
});


export default InteractiveOpenFolderContainer;