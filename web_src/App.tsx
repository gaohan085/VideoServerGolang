import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { SWRConfig } from "swr";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import * as Components from "./Components";
import * as lib from "./lib";
import { Player } from "./plyr";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>      <Player />
        <Components.InteractiveSidebar /></>
    ),
    errorElement: <div>Not Found</div>
  },

]);

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
          <RouterProvider router={router} />
        </Provider>
      </SWRConfig>
    </StrictMode>
  );
};
