import React from "react";
import { useRouteError } from "react-router";
import * as styles from "./error-page.module.scss";

const ErrorPage: React.FC = () => {
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

export default ErrorPage;
