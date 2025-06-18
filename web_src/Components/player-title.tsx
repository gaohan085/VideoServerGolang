"use client";

import { Link } from "@tanstack/react-router";
import React, { Suspense } from "react";
import { FaHashtag, FaLink } from "react-icons/fa";
import { PiGenderFemaleBold, PiGenderMaleBold } from "react-icons/pi";
import useSWR from "swr";
import * as redux from "../lib/reduxStore.ts";
import styles from "./player-title.module.scss";
import Spinner from "./spinner.tsx";

type QueryInfoBySN = {
  statusCode: number;
  data: VideoDetail;
};

type VideoDetail = {
  sn: string
  title: string;
  releaseDate: Date;
  duration: number;
  director: string;
  publisher: string;
  series: string;
  rank: number;
  sourceUrl: string;
  tags: string[];
  actors: { name: string; sex: "male" | "female" }[];
};

const Tags: React.FC<{ tags: string[] }> = (props) => {
  const { tags } = props;
  return (
    <div className={styles.tag}><strong>{"标签:"}</strong>
      {tags.map((tag, index) => {
        return <Link to={`/tag/${tag}`} key={index} ><span><FaHashtag /></span>{tag}</Link>;
      })}
    </div>
  );
};

const Actors: React.FC<{ actors: { name: string; sex: "male" | "female" }[] }> = (props) => {
  const { actors } = props;
  return (
    <div className={styles.actor}><strong>{"演员:"}</strong>
      {actors.map((actor, index) => {
        const IsFemale = actor.sex === "female";
        return (
          <Link to={`/actor/${actor.name}`} key={index}>
            <span style={{ color: IsFemale ? "#e85982" : "" }}>
              {!!IsFemale && <PiGenderFemaleBold />}
              {!IsFemale && <PiGenderMaleBold />}
            </span>
            {actor.name}
          </Link>
        );
      })}
    </div>
  );
};

const VideoInfo: React.FC<{ sn: string }> = (props) => {
  const { sn } = props;
  const { data } = useSWR<QueryInfoBySN>(`/api/query/sn/${sn}`);
  const {
    title,
    releaseDate,
    duration,
    publisher,
    series,
    rank,
    sourceUrl,
    tags,
    actors,
    director
  } = data!.data;

  return (
    <div className={styles["video-info"]}>
      <h4>
        {`${sn.toLocaleUpperCase()} ${title}`}
      </h4>
      <div className="info">
        {
          !!title &&
          <>
            <div><strong>{"发售日期:"}</strong>{`${(new Date(releaseDate)).toLocaleDateString("zh-CN")}`}</div>
            <div><strong>{"时长:"}</strong>{`${duration}min`}</div>
            <div><strong>{"导演:"}</strong><Link to={`/director/${director}`} className="link">{`${director}`}</Link></div>
            <div><strong>{"发行商:"}</strong><Link to={`/publisher/${publisher}`} className="link">{`${publisher}`}</Link></div>
            {!!series && <div><strong>{"系列:"}</strong><Link to={`/series/${series}`} className="link">{`${series}`}</Link></div>}
            <div><strong>{"评分:"}</strong>{`${rank}`}</div>
            <Tags tags={tags} />
            <Actors actors={actors} />
            <div><strong>{"外部链接:"}</strong><span><FaLink /></span>
              <a href={sourceUrl} target="_blank" rel="noreferrer" className="link">
                {"JavDB"}
              </a>
            </div>
          </>
        }
      </div>
    </div>
  );
};

const InfoPreserveLayer: React.FC = () => {
  const { sn } = redux.useAppSelector(redux.selectVideoPlaying);

  return (
    <>
      {!!sn && (
        <Suspense fallback={
          <div className={styles.loader}>
            <Spinner fontSize={28} />
          </div>
        }>
          <VideoInfo sn={sn} />
        </Suspense>
      )}
      {!sn && <div className={styles["video-info"]}>
        <h4>{"没有正在播放"}</h4>
      </div>}
    </>
  );
};

export default InfoPreserveLayer;
