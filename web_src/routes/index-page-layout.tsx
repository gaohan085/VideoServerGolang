import React, { lazy } from "react";

const LazyWsLayer = lazy(() => import("../Components/websocket.tsx"));
const LazyFileSysSideBar = lazy(() => import("../Components/file-system-sidebar.tsx"));


export default function IndexPageSideBarLayout() {
  return (
    <LazyWsLayer>
      <LazyFileSysSideBar />
    </LazyWsLayer>
  );
}