import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { SWRConfig } from "swr";
import * as redux from "./lib/reduxStore";
import fetcher from "./lib/fetcher";
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