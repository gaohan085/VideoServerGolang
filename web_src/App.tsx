import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { SWRConfig } from "swr";

import * as Components from "./Components";
import * as lib from "./lib";
import { Player } from "./plyr";
import styles from "./App.module.scss"

export const renderApp = (app: HTMLElement): void => {
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
          <div className={styles.layout} >
            <div className="player"><Player /></div>
            <Components.InteractiveSidebar />
            <Components.StatusBar />
          </div>
        </Provider>
      </SWRConfig>
    </StrictMode>,
  );
};
