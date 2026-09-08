"use client";

import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { lazy } from "react";
import Spinner from "../Components/spinner.tsx";
import type { ResWithActressName } from "../Components/types.js";
import fetcher from "../lib/fetcher.ts";
import useTitle from "../lib/useTitle.ts";

const LazyVideoBox = lazy(
  () => import("../Components/video-boxes-sidebar.tsx"),
);

const ActressNameComponent = () => {
  const { name } = Route.useParams();
  useTitle(`导演：${name as string}`);
  const { data: videos }: ResWithActressName = useLoaderData({
    from: "/director/$name",
  });

  return <LazyVideoBox videos={videos} />;
};

export const Route = createFileRoute("/director/$name")({
  component: () => <ActressNameComponent />,
  loader: async ({ params: { name } }) =>
    await fetcher(`/api/query/director/${name}`),
  pendingComponent: () => (
    <div style={{ display: "flex", minWidth: 320, margin: "auto" }}>
      <Spinner fontSize={24} />
    </div>
  ),
  errorComponent: (e) => <>{e.error.message}</>,
});
