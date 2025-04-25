"use client";

import { createFileRoute } from "@tanstack/react-router";
import { lazy } from "react";
import Spinner from "../Components/spinner.tsx";
import fetcher from "../lib/fetcher.ts";

const LazyVideoBox = lazy(() => import("../Components/video-boxes-sidebar.tsx"));
const LazyWsLayer = lazy(() => import("../Components/websocket.tsx"));


export const Route = createFileRoute("/actress/$name")({
  component: () => (
    <LazyWsLayer>
      <LazyVideoBox />
    </LazyWsLayer>
  ),
  loader: async ({ params: { name } }) => (await fetcher(`/api/actress/${name}`)),
  pendingComponent: () => <Spinner fontSize={24} />
});
