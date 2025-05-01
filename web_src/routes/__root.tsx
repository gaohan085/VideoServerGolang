"use client";

import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { lazy, Suspense } from "react";
import Spinner from "../Components/spinner.tsx";

const LazyPlayer = lazy(() => import("../Components/player.tsx"));

export const Route = createRootRoute({
  component: () => (
    <>
      <Suspense fallback={<Spinner fontSize={30} />}>
        <LazyPlayer />
        <Outlet />
      </Suspense>
      <TanStackRouterDevtools />
    </>
  ),
});
