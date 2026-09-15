"use client";

import { createFileRoute } from "@tanstack/react-router";
import { lazy, useEffect } from "react";
import Spinner from "../Components/spinner.tsx";
import useBoundStore from "../lib/zustand-store.ts";

const LazyFileSysSideBar = lazy(
  () => import("../Components/FileStructure/file-system-sidebar.tsx"),
);

const IndexLayout = () => {
  const { isClicked, setIsClicked } = useBoundStore((state) => state);

  useEffect(() => {
    return () => {
      if (!isClicked) setIsClicked(true);
    };
  }, [isClicked, setIsClicked]);
  return <LazyFileSysSideBar />;
};

export const Route = createFileRoute("/")({
  component: IndexLayout,
  pendingComponent: () => <Spinner fontSize={24} />,
});
