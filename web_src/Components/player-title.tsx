"use client";

import { Link } from "@tanstack/react-router";
import React from "react";
import { FaHashtag } from "react-icons/fa6";
import { FcLink } from "react-icons/fc";
import * as redux from "../lib/reduxStore.ts";
import styles from "./player-title.module.scss";

const Tag: React.FC<Readonly<{ tag: string }>> = ({ tag }) => (

  <Link to={`/tag/${tag}`}>
    <span><FaHashtag /></span>
    {tag}
  </Link>
);

const Tags: React.FC<Readonly<{ tags: Array<string> }>> = (props) => {
  const { tags } = props;

  return (
    <div className={styles.tags}>
      {tags.map((tag, index) => (
        <Tag tag={tag} key={index} />
      ))}
    </div>
  );
};

const VideoInfo: React.FC = () => {
  const videoPlaying = redux.useAppSelector(redux.selectVideoPlaying);
  const serialNumber = videoPlaying.name.match(
    /([0-9]|[a-z]|[A-Z]){3,}-[0-9]{3,}/g,
  );

  const tags = ["标签1", "标签2"];

  return (
    <div className={styles["video-info"]}>
      <h4>
        {!!videoPlaying.name
          && `${serialNumber ? serialNumber[0] : videoPlaying.name} ${videoPlaying.title}`}
        {!videoPlaying.name && "没有正在播放"}
      </h4>
      <Tags tags={tags} />
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
            On JavDB
          </a>
        )}
      </div>
    </div>
  );
};

export default VideoInfo;
