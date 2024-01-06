import "../assets/Roboto-Regular.ttf";
import "./index.css";
1

import { renderApp } from "./App";
const app = document.getElementById("app");

renderApp(app!);

if (import.meta.hot) {
  import.meta.hot.accept("./App.tsx", () => {
    return;
  });
}
