/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import "./index.css";

import { mountPlyr } from "./plyr";
import * as App from "./App";

const app = document.getElementById("app");
App.renderSidebar(app!);

const statusbar = document.getElementById("statusbar");
App.renderStatusbar(statusbar!);

const videoNode = document.getElementById("plyr");

void mountPlyr(videoNode!);

if ((module as any).hot) {
  (module as any).hot.accept("./App.tsx");
  (module as any).hot.accept("./plyr.ts");
}
