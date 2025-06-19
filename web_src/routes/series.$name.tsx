"use client";

import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import React, { lazy } from "react";
import Spinner from "../Components/spinner.tsx";
import type { ResWithActressName } from "../Components/types.js";
import fetcher from "../lib/fetcher.ts";
import useTitle from "../lib/useTitle.ts";

const LazyVideoBox = lazy(() => import("../Components/video-boxes-sidebar.tsx"));
const LazyWsLayer = lazy(() => import("../Components/websocket.tsx"));


const ActressNameComponent: React.FC = () => {
  const { name } = Route.useParams();
  useTitle(`系列：${name as string}`);
  const { data: videos }: ResWithActressName = useLoaderData({ from: "/series/$name" });

  return (
    <LazyWsLayer>
      <LazyVideoBox videos={videos} />
    </LazyWsLayer>
  );
};

export const Route = createFileRoute("/series/$name")({
  component: () => <ActressNameComponent />,
  loader: async ({ params: { name } }) => (await fetcher(`/api/query/series/${name}`)),
  pendingComponent: () => <div style={{ display: "flex", minWidth:320  }}><Spinner fontSize={24} /></div>,
  errorComponent: e => (
    <>
      {e.error.message}
    </>
  )
});