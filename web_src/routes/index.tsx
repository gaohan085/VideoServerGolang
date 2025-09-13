"use client";

import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import Spinner from "../Components/spinner.tsx";

const LazyWsLayer = lazy(() => import("../Components/websocket.tsx"));
const LazyFileSysSideBar = lazy(() => import("../Components/FileStructure/file-system-sidebar.tsx"));

export const Route = createFileRoute("/")({
  component: () => (
    <LazyWsLayer>
      <LazyFileSysSideBar />
    </LazyWsLayer>
  ),
  pendingComponent: () => <Spinner fontSize={24} />,
});
