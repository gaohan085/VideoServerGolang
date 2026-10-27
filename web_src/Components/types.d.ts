import type { useState } from "react";
import type useSWR from "swr";
import type { FolderElementClass } from "./FileStructure/container-element.tsx";


type InterfaceMutateFunc = ReturnType<
  typeof useSWR<{ statusCode: number; data: DirectoryProp } | Error>
>["mutate"];

type RespElement = {
  name: string
  type: "file" | "directory",
  mtime: string,
  size: number,
};

type DirElement = RespElement & {
  sn: string;
  isFile: boolean;
  isFolder: boolean;
  isVideo: boolean;
  extName: string;
  playSrc: string;
  cwd: string
};

type DirectoryProp = {
  /** cwd 必须包含末尾斜杠，如果为根目录则为 "/" */
  cwd: string
  childElements: FolderElement[];
};

type UseStateReturnType<T> = ReturnType<typeof useState<T>>;
type ResWithActressName = {
  statusCode: number;
  data: VideoInfo[];
};

type VideoInfo = {
  sn: string;
  title: string;
  posterUrl: string;
  playSrc: string;
  actors: {actorName: string, sex: "male" | "female"}[]
};

interface VideoStatus {
  fileName: string;
  path: string;
  status: "pending" | "converting" | "done";
  duration: number;
  progress: number;
  playSource: string;
}

type VideoCvQueue = VideoStatus[];

type FolderElementClass = FolderElementClass;
