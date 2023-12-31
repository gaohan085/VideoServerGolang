import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { SWRConfig } from "swr";

import * as Components from "./Components";
import * as lib from "./lib";

export const renderSidebar = (app: HTMLElement): void => {
  createRoot(app).render(
    <StrictMode>
      <SWRConfig
        value={{
          refreshInterval: 120000,
          fetcher: lib.fetcher,
          revalidateOnFocus: false,
        }}
      >
        <Provider store={lib.redux.store}>
          <Components.InteractiveSidebar />
        </Provider>
      </SWRConfig>
    </StrictMode>,
  );
};

export const renderStatusbar = (statusbar: HTMLElement): void => {
  createRoot(statusbar).render(
    <StrictMode>
      <SWRConfig
        value={{
          refreshInterval: 120000,
          fetcher: lib.fetcher,
          revalidateOnFocus: false,
        }}
      >
        <Provider store={lib.redux.store}>
          <Components.StatusBar />
        </Provider>
      </SWRConfig>
    </StrictMode>,
  );
};
