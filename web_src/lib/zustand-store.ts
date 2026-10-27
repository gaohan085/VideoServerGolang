import { create, type StateCreator } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";
import type { RespElement, VideoCvQueue } from "../Components/types.d.ts";

type PlayingVideoStore = {
  currentPlayingVideo: {playSrc: string, sn: string, name: string};
  setVideoPlaying: (
    video: {playSrc: string, sn: string, name: string},
  ) => void;
  unSetVideoPlaying: () => void;
};

const createPlayingVideoStore: StateCreator<PlayingVideoStore> = (set) => ({
  currentPlayingVideo: { name: "", sn: "", playSrc: ""},
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


type SelectedElemStore = {
  openFolderPath: string;
  rClickElem: RespElement &{path: string};
  renameElem: RespElement&{path: string};

  setOpenFolderPath: (path: string) => void;
  unSetOpenFolderPath: () => void;

  setRClickElem: (elem: RespElement&{path: string}) => void;
  unSetRClickElem: () => void;

  setRenameElem: (elem: RespElement&{path: string}) => void;
  unSetRenameElem: () => void;
};

const createSelectElemStore: StateCreator<SelectedElemStore> = (set) => ({
  openFolderPath: "",
  rClickElem: {name:"", type:"file", mtime:"", size:0, path:""},
  renameElem: {name:"", type:"file", mtime:"", size:0, path:""},

  setOpenFolderPath: (path) => set(() => ({ openFolderPath: path })),
  unSetOpenFolderPath: () => set(() => ({ openFolderPath: "/" })),

  setRClickElem: (elem) => set(() => ({ rClickElem: elem })),
  unSetRClickElem: () => set(() => ({ rClickElem: {name:"", type:"file", mtime:"", size:0, path:""}, })),

  setRenameElem: (elem) => set(() => ({ renameElem: elem })),
  unSetRenameElem: () => set(() => ({ renameElem: {name:"", type:"file", mtime:"", size:0, path:""}, })),
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
    VideoCVQueueStore
>()(
  devtools(
    subscribeWithSelector((...a) => ({
      ...createPlayingVideoStore(...a),
      ...createSidebarStatusStore(...a),
      ...createClickedStore(...a),
      ...createRClickPosition(...a),
      ...createSelectElemStore(...a),
      ...createVideoCVQueueStore(...a),
    })),
  ),
);

export default useBoundStore;
