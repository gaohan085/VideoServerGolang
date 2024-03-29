import { useRouteError } from "react-router";
import React from "react";

import styles from "./error-page.module.scss";

export const ErrorPage: React.FC = () => {
  const error = useRouteError();

  return (
    <div className={styles["error-page"]}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occured.</p>
      <p>
        <i>
          {(error as { statusText: string }).statusText ||
            (error as Error).message}
        </i>
      </p>
    </div>
  );
};
