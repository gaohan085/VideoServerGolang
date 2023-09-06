import FileElem from "./file-element";
import { FolderElem } from "./folder-element";
import React from "react";
import useSWR from "swr";
import type { DirChildElem, Folder } from "./file-element";

/**
 * Compatible Layer
 * @param props
 * @returns
 */
export const OpenFolderContainer: React.FC<{
  elems: DirChildElem[];
  mutateFunc: ReturnType<typeof useSWR<Folder, Error>>["mutate"];
}> = (props) => {
  return (
    <>
      {props.elems
        // Sort the folder and file element, folder is ahead of file
        // .sort((a, b) => sort(a, b))
        .map((elem, index) => {
          return elem.isFile ? (
            <FileElem key={index} {...elem} mutateFunc={props.mutateFunc} />
          ) : (
            <FolderElem key={index} {...elem} mutateFunc={props.mutateFunc} />
          );
        })}
    </>
  );
};
