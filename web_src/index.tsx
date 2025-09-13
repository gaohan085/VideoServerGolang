"use client";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import icon from "../assets/favicon.ico";
import "../assets/Roboto-Regular.ttf";
import App from "./App.tsx";

const head = document.querySelector("head");
const favicon = document.createElement("link");
favicon.setAttribute("rel", "icon");
favicon.setAttribute("href", icon);
head?.appendChild(favicon);

const appNode = document.getElementById("main");

createRoot(appNode!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
