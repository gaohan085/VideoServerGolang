import icon from "../assets/favicon.ico";
import "../assets/Roboto-Regular.ttf";
import "./index.css";

import * as app from "./App";
import { mountPlyr } from "./plyr";

const head = document.querySelector("head");
const favicon = document.createElement("link");
favicon.setAttribute("rel", "icon");
favicon.setAttribute("href", icon);
head?.appendChild(favicon);

const appNode = document.getElementById("app");
void app.renderSidebar(appNode!);

const statusbar = document.getElementById("statusbar");
void app.renderStatusbar(statusbar!);

const videoNode = document.getElementById("plyr");

void mountPlyr(videoNode!);

if (import.meta.hot) {
  import.meta.hot.accept(["./plyr.ts", "./App.tsx"], () => {
    return;
  });
}
