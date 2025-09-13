"use client";

import { createRouter, RouterProvider } from "@tanstack/react-router";
import { LazyMotion } from "motion/react";
import React from "react";
import { Provider } from "react-redux";
import { SWRConfig } from "swr";
import Spinner from "./Components/spinner.tsx";
import fetcher from "./lib/fetcher.ts";
import * as redux from "./lib/reduxStore.ts";
import { routeTree } from "./routeTree.gen.ts";

const loadFeatures = () => import("./motionFeatures.ts").then(res => res.default);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App: React.FC = () => {
  return (
    <SWRConfig
      value={{
        refreshInterval: 120000,
        fetcher: fetcher,
        revalidateOnFocus: true,
        suspense: true,
      }}
    >
      <Provider store={redux.store}>
        <LazyMotion features={loadFeatures} strict>
          <RouterProvider router={router} defaultPendingComponent={() => <Spinner fontSize={24} />} />
        </LazyMotion>
      </Provider>
    </SWRConfig>
  );
};

export default App;
