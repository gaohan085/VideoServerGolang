"use client";

import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";

const LazyWsLayer = lazy(() => import("../Components/websocket.tsx"));
const LazyFileSysSideBar = lazy(() => import("../Components/file-system-sidebar.tsx"));

export const Route = createFileRoute("/")({
  component: () => (
    <LazyWsLayer>
      <LazyFileSysSideBar />
    </LazyWsLayer>
  ),
});
