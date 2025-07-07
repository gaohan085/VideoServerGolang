"use client";

import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import icon from "../assets/favicon.ico";
import "../assets/Roboto-Regular.ttf";
import Spinner from "./Components/spinner.tsx";

const head = document.querySelector("head");
const favicon = document.createElement("link");
favicon.setAttribute("rel", "icon");
favicon.setAttribute("href", icon);
head?.appendChild(favicon);

const appNode = document.getElementById("main");

const App = lazy(() => import("./App.tsx"));

createRoot(appNode!).render(
  <StrictMode>
    <Suspense fallback={<Spinner fontSize={30}/>}>
      <App />
    </Suspense>
  </StrictMode>
);
