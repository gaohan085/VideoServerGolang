import "../assets/Roboto-Regular.ttf";
import icon from "../assets/favicon.ico";
import renderApp from "./App";

const head = document.querySelector("head");
const favicon = document.createElement("link");
favicon.setAttribute("rel", "icon");
favicon.setAttribute("href", icon);
head?.appendChild(favicon);

const appNode = document.getElementById("main");
void renderApp(appNode!);

if (import.meta.hot) {
  import.meta.hot.accept("./App.tsx", () => {
    return;
  });
}
