import React, {lazy} from "react";

const LazyVideoBox = lazy(()=>import("../Components/video-boxes-sidebar"));
const LazyWsLayer = lazy(()=>import("../Components/websocket"));

const ActressByName = () => {
  return (
    <LazyWsLayer>
      <LazyVideoBox />
    </LazyWsLayer>
  );
};

export default ActressByName;