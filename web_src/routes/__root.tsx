"use client";

import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { lazy } from "react";

const LazyPlayer = lazy(() => import("../Components/player.tsx"));

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="outlet">
        <LazyPlayer />
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </>
  ),
  errorComponent: (e) => (
    <>
      {e.error.message}
    </>
  )
});
