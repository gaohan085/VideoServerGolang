import React, { forwardRef, type LegacyRef } from "react";

import * as lib from "../lib";

import {
  type DirectoryProp,
  InteractiveFileElement,
  InteractiveFolderElement,
} from ".";

export const OpenFolderContainer = forwardRef(function Container(
  props: { data: DirectoryProp, isOpen: boolean }, ref: LegacyRef<HTMLDivElement>
) {
  const { data, isOpen } = props;
  return (
    !!isOpen && <div id="open-folder-container" ref={ref}>
      {data.childElements
        .sort((a, b) => lib.sortElements(a, b))
        .map((elem, index) => {
          return elem.isFile ? (
            <InteractiveFileElement elem={elem} key={index} />
          ) : (
            <InteractiveFolderElement elem={elem} key={index} />
          );
        })}
    </div>);
});

export const InteractiveOpenFolderContainer: React.FC<{
  readonly data: DirectoryProp;
}> = ({ data }) => {
  return (
    <div id="open-folder-container">
      {data?.childElements
        .sort((a, b) => lib.sortElements(a, b))
        .map((elem, index) => {
          return elem.isFile ? (
            <InteractiveFileElement elem={elem} key={index} />
          ) : (
            <InteractiveFolderElement elem={elem} key={index} />
          );
        })}
    </div>);
};

export default InteractiveOpenFolderContainer;