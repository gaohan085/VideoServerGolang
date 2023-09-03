import React, { useEffect } from "react";
import { selectPlaySrc, useAppSelector } from "./lib/reduxStore";
import styles from "./App.module.scss";

export const App = () => {
  const playSrc = useAppSelector(selectPlaySrc);

  useEffect(()=>{
    document.title = playSrc;
  }, [playSrc])

  return (
    <div className={styles.layout}>
      <div className="main">
      </div>
    </div>
  );
};
