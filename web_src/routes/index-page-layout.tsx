import React, { lazy } from "react";

const LazyWsLayer = lazy(() => import("../Components/websocket"));
const LazyFileSysSideBar = lazy(() => import("../Components/file-system-sidebar"));


export default function IndexPageSideBarLayout() {
  return (
    <LazyWsLayer>
      <LazyFileSysSideBar />
    </LazyWsLayer>
  );
}