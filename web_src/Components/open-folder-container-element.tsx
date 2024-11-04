import React from "react";

import * as lib from "../lib";

import {
  type DirectoryProp,
  type DirElement,
  InteractiveFileElement,
  InteractiveFolderElement,
} from ".";

const OpenFolderContainer: React.FC<{
  readonly elems: DirElement[];
}> = ({ elems }) => {
  return (
    <>
      {elems
        .sort((a, b) => lib.sortElements(a, b))
        .map((elem, index) => {
          return elem.isFile ? (
            <InteractiveFileElement elem={elem} key={index} />
          ) : (
            <InteractiveFolderElement elem={elem} key={index} />
          );
        })}
    </>
  );
};

const InteractiveOpenFolderContainer: React.FC<{
  readonly data: DirectoryProp;
}> = ({ data }) => {
  return <OpenFolderContainer elems={data.childElements} />;
};

export default InteractiveOpenFolderContainer;