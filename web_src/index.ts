/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import "./index.css";
import { renderApp } from "./App";

const app = document.getElementById("app")!;
void renderApp(app);

if ((module as any).hot) {
  (module as any).hot.accept("./App.tsx");
}
