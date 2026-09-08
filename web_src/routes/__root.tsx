"use client";

import { createRootRoute, Outlet } from "@tanstack/react-router";
import { lazy, useEffect } from "react";
import InteractiveCtxMenu from "../Components/FileStructure/context-menu.tsx";
import Spinner from "../Components/spinner.tsx";
import useBoundStore from "../lib/zustand-store.ts";

const LazyPlayer = lazy(() => import("../Components/player.tsx"));
const LazyWsLayer = lazy(() => import("../Components/websocket.tsx"));
const LazySidebar = lazy(() => import("../Components/sidebar.tsx"));

const RootLayout = () => {
  const { isClicked } = useBoundStore((state) => state);

  return (
    <>
      {/*class outlet defined in index.html*/}
      <div className="outlet">
        <LazyPlayer />
        <LazyWsLayer>
          <LazySidebar>
            <Outlet />
          </LazySidebar>
          {!isClicked && <InteractiveCtxMenu />}
        </LazyWsLayer>
      </div>
    </>
  );
};

export const Route = createRootRoute({
  component: () => <RootLayout />,
  pendingComponent: () => (
    <div style={{ display: "flex", minWidth: 320, margin: "auto" }}>
      <Spinner fontSize={24} />
    </div>
  ),
  errorComponent: (e) => <>{e.error.message}</>,
});
