"use client";

import {
  createBrowserHistory,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { Base64 } from "js-base64";
import { LazyMotion } from "motion/react";
import { SWRConfig } from "swr";
import Spinner from "./Components/spinner.tsx";
import fetcher from "./lib/fetcher.ts";
import { routeTree } from "./routeTree.gen.ts";

const loadFeatures = () =>
  import("./motionFeatures.ts").then((res) => res.default);

const router = createRouter({
  routeTree,
  history: createBrowserHistory(),
  parseSearch: (value) => {
    if (value === "") return;
    return JSON.parse(Base64.decode(value.slice(3)));
  },
  stringifySearch: (value) => {
    if (value === undefined) return "";
    const result = Base64.encode(JSON.stringify(value));
    return "?s=" + result;
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  return (
    <SWRConfig
      value={{
        refreshInterval: 120000,
        fetcher: fetcher,
        revalidateOnFocus: true,
        suspense: true,
      }}
    >
      <LazyMotion features={loadFeatures} strict>
        <RouterProvider
          router={router}
          defaultPendingComponent={() => <Spinner fontSize={24} />}
          defaultNotFoundComponent={() => <>{"Page Not Found"}</>}
        />
      </LazyMotion>
    </SWRConfig>
  );
};

export default App;
