import {
  configureStore,
  createSlice
} from "@reduxjs/toolkit";
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";
import { type DirElement } from "../Components/types";
import type {
  Action,
  PayloadAction,
  ThunkAction} from "@reduxjs/toolkit";

declare interface PlayingVideo {
  playingVideo: DirElement;
}

const initialState: PlayingVideo = {
  playingVideo: {
    name: "",
    isFile: false,
    isFolder: false,
    extName: "",
    currentPath: "",
    playSrc: "",
    poster: "",
    title: "",
    actress: "",
    sourceUrl: "",
  },
};

export const Slice = createSlice({
  name: "redux",
  initialState,
  reducers: {
    setVideoPlaying(state, action: PayloadAction<DirElement>) {
      state.playingVideo = action.payload;
    },

    unSetVideoPlaying(state) {
      state.playingVideo = {
        name: "",
        isFile: false,
        isFolder: false,
        extName: "",
        currentPath: "",
        playSrc: "",
        poster: "",
        title: "",
        actress: "",
        sourceUrl: "",
      };
    },
  },
});

export const { setVideoPlaying, unSetVideoPlaying } = Slice.actions;

export function makeStore() {
  return configureStore({
    reducer: {
      redux: Slice.reducer,
    },
  });
}

export const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>;

export const selectVideoPlaying = (state: AppState) => state.redux.playingVideo;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
