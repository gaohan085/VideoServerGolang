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
  readonly elems: DirElement[];
  readonly mutateFunc: InterfaceMutateFunc;
}> = (props) => {
  const { elems, mutateFunc } = props;

  return (
    <>
      {elems
        .sort((a, b) => lib.sortElements(a, b))
        .map((elem, index) => {
          return elem.isFile ? (
            <InteractiveFileElement
              elem={elem}
              key={index}
              mutateFunc={mutateFunc}
            />
          ) : (
            <InteractiveFolderElement
              elem={elem}
              key={index}
              mutateFunc={mutateFunc}
            />
          );
        })}
    </>
  );
};

export const InteractiveOpenFolderContainer: React.FC<{
  readonly data: DirectoryProp;
  readonly mutateFunc: InterfaceMutateFunc;
}> = (props) => {
  return (
    <OpenFolderContainer
      elems={props.data.childElements}
      mutateFunc={props.mutateFunc}
    />
  );
};
