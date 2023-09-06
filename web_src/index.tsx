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
    <Provider store={store}>
      <SWRConfig value={{
        refreshInterval: 50000,
        fetcher: fetcher,
        revalidateOnFocus: true,
      }}>
      <App />
      </SWRConfig>
    </Provider>
  </StrictMode>
);
