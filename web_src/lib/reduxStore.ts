import {
  configureStore,
  createSlice,
  type Action,
  type PayloadAction,
  type ThunkAction,
} from "@reduxjs/toolkit";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import type { DirElement } from "../Components/types.d.ts";

interface PlayingVideo {
  playingVideo: Omit<DirElement, "name"| "isFile" | "isFolder" | "isVideo" | "extName" | "currentPath">;
}

const initialState: PlayingVideo = {
  playingVideo: {
    sn: "",
    playSrc: "",
    posterUrl: "",
  },
};

const Slice = createSlice({
  name: "redux",
  initialState,
  reducers: {
    setVideoPlaying(state, action: PayloadAction<Omit<DirElement, "name"| "isFile" | "isFolder" | "isVideo" | "extName" | "currentPath">>) {
      state.playingVideo = action.payload;
    },

    unSetVideoPlaying(state) {
      state.playingVideo = {
        sn: "",
        playSrc: "",
        posterUrl: ""
      };
    },
  },
});

const { setVideoPlaying, unSetVideoPlaying } = Slice.actions;

function makeStore() {
  return configureStore({
    reducer: {
      redux: Slice.reducer,
    },
  });
}

const store = makeStore();

type AppState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>;

const selectVideoPlaying = (state: AppState) => state.redux.playingVideo;

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export { Slice, setVideoPlaying, unSetVideoPlaying, makeStore, store, type AppState, type AppDispatch, type AppThunk, selectVideoPlaying, useAppDispatch, useAppSelector };
