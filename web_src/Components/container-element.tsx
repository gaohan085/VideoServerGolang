import React, { forwardRef } from "react";
import sortElements from "../lib/sort-elements-by-name";
import FileElement from "./file-element";
import FolderElement from "./folder-element";
import type { DirectoryProp } from "./types";


const Container = forwardRef<HTMLDivElement, DirectoryProp>((props, ref) => {
  const { childElements: elem } = props;

  return (
    <div id="container" ref={ref}>
      {!!elem && elem.sort((a, b) => sortElements(a, b)).map(
        (elem, index) => {
          if (elem.isFile) return <FileElement elem={elem} key={index} />;
          if (elem.isFolder) return <FolderElement elem={elem} key={index} />;
        }
      )}
      {!elem && <></>}
    </div>
  );
});

export default Container;