import React from "react";

import { type DirElement } from "../";
import * as lib from "../../lib";

export const VideoBox: React.FC<DirElement> = (props) => {
  const dispatch = lib.redux.useAppDispatch();
  const { title, poster } = props;

  const handleClick = () => {
    dispatch(lib.redux.setVideoPlaying(props));
  };
  return (
    <div className="videobox">
      <div className="img-box">
        <a onClick={handleClick}>
          <img src={poster} />
        </a>
      </div>
      <div className="title">
        <a onClick={handleClick}>{title}</a>
      </div>
    </div>
  );
};
