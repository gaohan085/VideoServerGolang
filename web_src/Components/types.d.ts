import type { useState } from "react";
import type useSWR from "swr";

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
  title: string;
  actress: string;
  sourceUrl: string;
}

export declare interface DirectoryProp {
  parentFolder: string; //relative path
  currentPath: string; //relative path
  childElements: DirElement[];
}

declare type UseStateReturnType<T> = ReturnType<typeof useState<T>>;
export interface ResWithActressName {
  statusCode: number;
  data: VideoInfo[];
}

declare interface VideoInfo {
  id: number;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
  playSrc: string;
  posterName: string;
  serialNumber: string;
  sourcePosterUrl: string;
  sourceUrl: string;
  title: string;
  actress: string;
}
