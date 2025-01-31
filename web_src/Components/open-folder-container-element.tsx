import React, { forwardRef, lazy, type LegacyRef } from "react";
import sortElements from "../lib/sort-elements-by-name";
import FileElement from "./file-element";
import type { DirectoryProp } from "./types";

const LazyFolderElement = lazy(()=>import("./folder-element"));

const OpenFolderContainer = forwardRef(function Container(
  props: { data: DirectoryProp, isOpen: boolean }, ref: LegacyRef<HTMLDivElement>
) {
  const { data, isOpen } = props;
  return (
    !!isOpen && <div id="open-folder-container" ref={ref}>
      {data.childElements
        .sort((a, b) => sortElements(a, b))
        .map((elem, index) => {
          return elem.isFile ? (
            <FileElement elem={elem} key={index} />
          ) : (
            <LazyFolderElement elem={elem} key={index} />
          );
        })}
    </div>);
});

export default OpenFolderContainer;