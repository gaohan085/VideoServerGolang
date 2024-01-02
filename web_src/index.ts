import icon from "../assets/favicon.ico";
import "../assets/Roboto-Regular.ttf";
import "./index.css";

import * as App from "./App";
import { mountPlyr } from "./plyr";

const head = document.querySelector("head");
const favicon = document.createElement("link");
favicon.setAttribute("rel", "icon");
favicon.setAttribute("href", icon);
head?.appendChild(favicon);

const app = document.getElementById("app");
App.renderSidebar(app!);

const statusbar = document.getElementById("statusbar");
App.renderStatusbar(statusbar!);

const videoNode = document.getElementById("plyr");

void mountPlyr(videoNode!);

if (import.meta.hot) {
  import.meta.hot.accept(["./plyr.ts", "./App.tsx"], () => {
    return;
  });
}
