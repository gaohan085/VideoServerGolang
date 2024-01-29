import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { SWRConfig } from "swr";

import * as Components from "./Components";
import * as lib from "./lib";
import { Plyer } from "./plyr";


export const renderApp = (app: HTMLElement): void => {
  createRoot(app).render(
    <StrictMode>
      <SWRConfig
        value={{
          refreshInterval: 120000,
          fetcher: lib.fetcher,
          revalidateOnFocus: true,
        }}
      >
        <Provider store={lib.redux.store}>
          <Plyer />
          <Components.InteractiveSidebar />
        </Provider>
      </SWRConfig>
    </StrictMode>
  );
};