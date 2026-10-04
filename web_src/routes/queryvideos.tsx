import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { lazy } from "react";
import { z } from "zod";
import Spinner from "../Components/spinner.tsx";
import { type ResWithActressName } from "../Components/types.js";
import fetcher from "../lib/fetcher.ts";

const LazyVideoBox = lazy(
  () => import("../Components/video-boxes-sidebar.tsx"),
);

const videoSearchSchema = z.object({
  actor: z.string().catch(""),
  director: z.string().catch(""),
  publisher: z.string().catch(""),
  series: z.string().catch(""),
  tag: z.string().catch(""),
});

export const Route = createFileRoute("/queryvideos")({
  validateSearch: videoSearchSchema,
  loaderDeps: ({ search: { actor, director, publisher, series, tag } }) => ({
    actor,
    director,
    publisher,
    series,
    tag,
  }),
  loader: async ({ deps: { actor, director, publisher, series, tag } }) => {
    const result = Object.entries({
      actor,
      director,
      publisher,
      series,
      tag,
    }).find(([_, value]) => value !== "");

    return await fetcher(`/api/query/${result![0]}/${result![1]}`);
  },
  component: () => <VideosComponent />,
  pendingComponent: () => (
    <div style={{ display: "flex", minWidth: 320, margin: "auto" }}>
      <Spinner fontSize={24} />
    </div>
  ),
  errorComponent: (e) => <>{e.error.message}</>,
});

const VideosComponent = () => {
  const { data: videos }: ResWithActressName = useLoaderData({
    from: "/queryvideos",
  });

  return <LazyVideoBox videos={videos} />;
};
