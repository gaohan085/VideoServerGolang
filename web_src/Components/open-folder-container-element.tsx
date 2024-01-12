import React from "react";

import * as lib from "../lib";

import {
  InteractiveFileElement,
  InteractiveFolderElement,
  type DirElement,
  type DirectoryProp
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
            <InteractiveFileElement
              elem={elem}
              key={index}
            />
          ) : (
            <InteractiveFolderElement
              elem={elem}
              key={index}
            />
          );
        })}
    </>
  );
};

export const InteractiveOpenFolderContainer: React.FC<{
  readonly data: DirectoryProp;
}> = ({ data }) => {
  return (
    <OpenFolderContainer
      elems={data.childElements}
    />
  );
};
