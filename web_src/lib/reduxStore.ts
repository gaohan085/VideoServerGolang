import {
  Action,
  configureStore,
  createSlice,
  PayloadAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from "react-redux";

export interface ReduxState {
  playSource: string;
}

const initialState: ReduxState = {
  playSource: "",
};

export const Slice = createSlice({
  name: "redux",
  initialState,
  reducers: {
    setPlaySource(state, action: PayloadAction<string>) {
      state.playSource = action.payload;
    },

    unSetPlaySource(state) {
      state.playSource = "";
    },
  },
});

export const { setPlaySource, unSetPlaySource } = Slice.actions;

export function makeStore() {
  return configureStore({
    reducer: {
      redux: Slice.reducer,
    },
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk = ThunkAction<void, AppState, unknown, Action<string>>;

export const selectPlaySrc = (state: AppState) => state.redux.playSource;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export default store;
