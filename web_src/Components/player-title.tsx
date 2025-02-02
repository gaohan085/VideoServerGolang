import { FcLink } from "react-icons/fc";
import { Link } from "react-router-dom";
import React from "react";
import * as redux from "../lib/reduxStore";
import styles from "./player-title.module.scss";

const Title: React.FC = () => {
  const videoPlaying = redux.useAppSelector(redux.selectVideoPlaying);
  const serialNumber = videoPlaying.name.match(
    /([0-9]|[a-z]|[A-Z]){3,}-[0-9]{3,}/g,
  );

  return (
    <div className={styles["player-title"]}>
      <h4>
        {!!videoPlaying.name &&
          `${serialNumber ? serialNumber[0] : videoPlaying.name} ${videoPlaying.title}`}
        {!videoPlaying.name && "没有正在播放"}
      </h4>
      <div className="info">
        {!!videoPlaying.actress && (
          <Link to={`/actress/${videoPlaying.actress}`}>
            {videoPlaying.actress}
          </Link>
        )}
        {!!videoPlaying.sourceUrl && (
          <a href={videoPlaying.sourceUrl} target="_blank" rel="noreferrer">
            <span>
              <FcLink />
            </span>
            {"On JavDB"}
          </a>
        )}
      </div>
    </div>
  );
};

export default Title;

