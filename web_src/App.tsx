import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { SWRConfig } from "swr";

import "./index.css"

import * as Components from "./Components";
import * as lib from "./lib";
import {Player} from "./player"

export const renderApp = (app: HTMLElement): void => {
  createRoot(app).render(
    <StrictMode>
      <SWRConfig
        value={{
          refreshInterval: 50000,
          fetcher: lib.fetcher,
          revalidateOnFocus: true,
        }}
      >
        <Provider store={lib.redux.store}>
          <Player />
          <Components.InteractiveSidebar />
          <Components.StatusBar />
        </Provider>
      </SWRConfig>
    </StrictMode>,
  )
}