import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SWRConfig } from "swr";

import * as lib from "./lib";
import * as Routes from "./routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Routes.MainPage />,
    errorElement: <Routes.ErrorPage />,
  },
  {
    path: "/actress/:name",
    element: <Routes.ActressByName />,
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
    </StrictMode>,
  );
};
