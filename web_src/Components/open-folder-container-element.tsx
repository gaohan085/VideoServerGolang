import React from "react";

import * as lib from "../lib";

import {
  InteractiveFileElement,
  InteractiveFolderElement,
  InterfaceMutateFunc,
  type DirElement,
  type DirectoryProp,
} from ".";

const OpenFolderContainer: React.FC<{
  elems: DirElement[];
  mutateFunc: InterfaceMutateFunc;
}> = (props) => {
  const { elems, mutateFunc } = props;

  return (
    <>
      {elems
        .sort((a, b) => lib.sortElements(a, b))
        .map((elem, index) => {
          return elem.isFile ? (
            <InteractiveFileElement
              key={index}
              elem={elem}
              mutateFunc={mutateFunc}
            />
          ) : (
            <InteractiveFolderElement
              key={index}
              elem={elem}
              mutateFunc={mutateFunc}
            />
          );
        })}
    </>
  );
};

export const InteractiveOpenFolderContainer: React.FC<{
  data: DirectoryProp;
  mutateFunc: InterfaceMutateFunc;
}> = (props) => {
  return (
    <OpenFolderContainer
      elems={props.data.childElements}
      mutateFunc={props.mutateFunc}
    />
  );
};
