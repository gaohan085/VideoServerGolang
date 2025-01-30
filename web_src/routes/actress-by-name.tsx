import React, { lazy } from "react";

const LazyWsLayer = lazy(()=>import("../Components/websocket"));
const LazyVideoBoxesByActress = lazy(()=>import("../Components/video-boxes-sidebar"));

const ActressByName = () => {
  return (
    <LazyWsLayer>
      <LazyVideoBoxesByActress />
    </LazyWsLayer>
  );
};

export default ActressByName;