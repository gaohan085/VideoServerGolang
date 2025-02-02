import {
  configureStore,
  createSlice,
  type Action,
  type PayloadAction,
  type ThunkAction
} from "@reduxjs/toolkit";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import { type DirElement } from "../Components/types.d";

interface PlayingVideo {
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

const Slice = createSlice({
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