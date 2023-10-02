import * as Components from "./Components";
import styles from "./App.module.scss";
import React, { useEffect } from "react";
import { selectPlaySrc, useAppSelector } from "./lib/reduxStore";

export const App = () => {
  const playSrc = useAppSelector(selectPlaySrc);

  useEffect(() => {
    document.title = playSrc;
  }, [playSrc]);

  return (
    <div className={styles.layout}>
      <div className='main'>
        <Components.SideBar />
      </div>
      <Components.StatusBar />
    </div>
  );
};
