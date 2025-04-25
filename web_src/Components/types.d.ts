import type { useState } from "react";
import type useSWR from "swr";

type InterfaceMutateFunc = ReturnType<
  typeof useSWR<{ statusCode: number; data: DirectoryProp } | Error>
>["mutate"];

type DirElement = {
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
};

type DirectoryProp = {
  parentFolder: string; //relative path
  currentPath: string; //relative path
  childElements: DirElement[];
};

type UseStateReturnType<T> = ReturnType<typeof useState<T>>;
type ResWithActressName = {
  statusCode: number;
  data: VideoInfo[];
};

type VideoInfo = {
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
};
