import type { useSWRConfig } from "swr";
import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import type { DirElement, VideoCvQueue } from "../Components/types.d.ts";

type PlayingVideoStore = {
  currentPlayingVideo: Omit<
    DirElement,
    "isFile" | "isFolder" | "isVideo" | "extName" | "currentPath"
  >;
  setVideoPlaying: (
    video: Omit<
      DirElement,
      "isFile" | "isFolder" | "isVideo" | "extName" | "currentPath"
    >,
  ) => void;
  unSetVideoPlaying: () => void;
};

const createPlayingVideoStore: StateCreator<PlayingVideoStore> = (set) => ({
  currentPlayingVideo: { name: "", sn: "", playSrc: "", posterUrl: "" },
  setVideoPlaying: (video) => set(() => ({ currentPlayingVideo: video })),
  unSetVideoPlaying: () => set(() => ({})),
});

interface SidebarStatus {
  isSidebarActive: boolean;

  setSidebarStatus: (status: boolean) => void;
  toggleSidebarStatus: () => void;
}

const createSidebarStatusStore: StateCreator<SidebarStatus> = (set) => ({
  isSidebarActive: false,
  setSidebarStatus: (status) => set(() => ({ isSidebarActive: status })),
  toggleSidebarStatus: () =>
    set((state) => ({ isSidebarActive: !state.isSidebarActive })),
});

const initialDirElem: DirElement = {
  name: "",
  sn: "",
  isFile: false,
  isFolder: false,
  isVideo: false,
  extName: "",
  playSrc: "",
  currentPath: "",
  posterUrl: "",
};

type SelectedElemStore = {
  openFolderPath: string;
  rClickElem: DirElement;
  renameElem: DirElement;

  setOpenFolderPath: (path: string) => void;
  unSetOpenFolderPath: () => void;

  setRClickElem: (elem: DirElement) => void;
  unSetRClickElem: () => void;

  setRenameElem: (elem: DirElement) => void;
  unSetRenameElem: () => void;
};

const createSelectElemStore: StateCreator<SelectedElemStore> = (set) => ({
  openFolderPath: "",
  rClickElem: initialDirElem,
  renameElem: initialDirElem,

  setOpenFolderPath: (path) => set(() => ({ openFolderPath: path })),
  unSetOpenFolderPath: () => set(() => ({ openFolderPath: "/" })),

  setRClickElem: (elem) => set(() => ({ rClickElem: elem })),
  unSetRClickElem: () => set(() => ({ rClickElem: initialDirElem })),

  setRenameElem: (elem) => set(() => ({ renameElem: elem })),
  unSetRenameElem: () => set(() => ({ renameElem: initialDirElem })),
});

interface ClickedStore {
  isClicked: boolean;
  setIsClicked: (clicked: boolean) => void;
  unSetIsClicked: () => void;
}

const createClickedStore: StateCreator<ClickedStore> = (set) => ({
  isClicked: true,
  setIsClicked: (isClicked) => set(() => ({ isClicked: isClicked })),
  unSetIsClicked: () => set(() => ({ isClicked: false })),
});

interface RClickPositionStore {
  position: {
    pageX: number;
    pageY: number;
  };
  setPosition: (position: { pageX: number; pageY: number }) => void;
  unSetPosition: () => void;
}

const createRClickPosition: StateCreator<RClickPositionStore> = (set) => ({
  position: { pageX: 0, pageY: 0 },
  setPosition: (position) => set(() => ({ position })),
  unSetPosition: () => set(() => ({ position: { pageX: 0, pageY: 0 } })),
});

interface MutateStore {
  mutate: ReturnType<typeof useSWRConfig>["mutate"] | undefined;
  setMutate: (mutate: ReturnType<typeof useSWRConfig>["mutate"]) => void;
}

const createMutateStore: StateCreator<MutateStore> = (set) => ({
  mutate: undefined,

  setMutate: (mutate) => set(() => ({ mutate: mutate })),
});

interface VideoCVQueueStore {
  videoCVQueue: VideoCvQueue;

  setVideoCVQueue: (queue: VideoCvQueue) => void;
}

const createVideoCVQueueStore: StateCreator<VideoCVQueueStore> = (set) => ({
  videoCVQueue: [],

  setVideoCVQueue: (queue) => set(() => ({ videoCVQueue: queue })),
});

const useBoundStore = create<
  PlayingVideoStore &
    SidebarStatus &
    ClickedStore &
    RClickPositionStore &
    SelectedElemStore &
    MutateStore &
    VideoCVQueueStore
>()(
  devtools((...a) => ({
    ...createPlayingVideoStore(...a),
    ...createSidebarStatusStore(...a),
    ...createClickedStore(...a),
    ...createRClickPosition(...a),
    ...createSelectElemStore(...a),
    ...createMutateStore(...a),
    ...createVideoCVQueueStore(...a),
  })),
);

export default useBoundStore;
