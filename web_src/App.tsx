"use client";

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { SWRConfig } from "swr";
import fetcher from "./lib/fetcher";
import * as redux from "./lib/reduxStore";
import Routes from "./routes/routes";

const renderApp = (app: HTMLElement): void => {
  createRoot(app).render(
    <StrictMode>
      <SWRConfig
        value={{
          refreshInterval: 120000,
          fetcher: fetcher,
          revalidateOnFocus: true,
        }}
      >
        <Provider store={redux.store}>
          <Routes />
        </Provider>
      </SWRConfig>
    </StrictMode>,
  );
};

export default renderApp;