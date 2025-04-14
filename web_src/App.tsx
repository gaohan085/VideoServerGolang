"use client";

import { LazyMotion } from "motion/react";
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { SWRConfig } from "swr";
import fetcher from "./lib/fetcher";
import * as redux from "./lib/reduxStore";
import Routes from "./routes/routes";

const loadFeatures = () => import("./motionFeatures").then(res => res.default);

const renderApp = (app: HTMLElement): void => {
  createRoot(app).render(
    <StrictMode>
      <SWRConfig
        value={{
          refreshInterval: 120000,
          fetcher: fetcher,
          revalidateOnFocus: true,
          suspense: true
        }}
      >
        <Provider store={redux.store}>
          <LazyMotion features={loadFeatures} strict>
            <Routes />
          </LazyMotion>
        </Provider>
      </SWRConfig>
    </StrictMode>,
  );
};

export default renderApp;