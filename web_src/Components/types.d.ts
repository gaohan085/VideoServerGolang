import { useState } from "react";
import useSWR from "swr";

export declare type InterfaceMutateFunc = ReturnType<
  typeof useSWR<{ statusCode: number; data: DirectoryProp } | Error>
>["mutate"];

declare interface DirElement {
  name: string;
  isFile: boolean;
  isFolder: boolean;
  extName: string;
  playSrc: string;
  currentPath: string; //relative path
  poster: string;
}

export declare interface DirectoryProp {
  parentFolder: string; //relative path
  currentPath: string; //relative path
  childElements: DirElement[];
}

declare type UseStateReturnType<T> = ReturnType<typeof useState<T>>;
