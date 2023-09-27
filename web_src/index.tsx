/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { App } from "./App";
import { createRoot } from "react-dom/client";
import { fetcher } from "./lib/fetcher";
import { Provider } from "react-redux";
import store from "./lib/reduxStore";
import { SWRConfig } from "swr";
import React, { StrictMode } from "react";

const app = document.getElementById("app");

createRoot(app).render(
  <StrictMode>
    <SWRConfig
      value={{
        refreshInterval: 50000,
        fetcher: fetcher,
        revalidateOnFocus: true,
      }}>
      <Provider store={store}>
        <App />
      </Provider>
    </SWRConfig>
  </StrictMode>
);
