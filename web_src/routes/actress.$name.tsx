"use client";

import { createFileRoute } from "@tanstack/react-router";
import React, { lazy } from "react";
import Spinner from "../Components/spinner.tsx";
import fetcher from "../lib/fetcher.ts";
import useTitle from "../lib/useTitle.ts";

const LazyVideoBox = lazy(() => import("../Components/video-boxes-sidebar.tsx"));
const LazyWsLayer = lazy(() => import("../Components/websocket.tsx"));


const ActressNameComponent: React.FC = () => {
  const { name } = Route.useParams();
  useTitle(name as string);
  return (
    <LazyWsLayer>
      <LazyVideoBox />
    </LazyWsLayer>
  );
};

export const Route = createFileRoute("/actress/$name")({
  component: ActressNameComponent,
  loader: async ({ params: { name } }) => (await fetcher(`/api/actress/${name}`)),
  pendingComponent: () => <Spinner fontSize={24} />,
  errorComponent: e => (
    <>
      {e.error.message}
    </>
  )
});