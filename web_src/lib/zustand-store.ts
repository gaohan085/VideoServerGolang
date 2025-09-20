import { create } from "zustand";
import type { DirElement } from "../Components/types.js";

type PlayingVideoStore = Omit<DirElement, "isFile" | "isFolder" | "isVideo" | "extName" | "currentPath">;

type Action = {
  setVideoPlaying: (video: PlayingVideoStore) => void;
  unSetVideoPlaying: () => void
};

const useStore = create<PlayingVideoStore & Action>((set) => ({
  name: "",
  sn: "",
  playSrc: "",
  posterUrl: "",
  setVideoPlaying: (video) => set(() => ({ ...video })),
  unSetVideoPlaying: () => set(() => ({}))
}));

export default useStore;