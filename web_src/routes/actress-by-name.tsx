import React, {lazy} from "react";

const LazyVideoBox = lazy(()=>import("../Components/video-boxes-sidebar.tsx"));
const LazyWsLayer = lazy(()=>import("../Components/websocket.tsx"));

const ActressByName = () => {
  return (
    <LazyWsLayer>
      <LazyVideoBox />
    </LazyWsLayer>
  );
};

export default ActressByName;