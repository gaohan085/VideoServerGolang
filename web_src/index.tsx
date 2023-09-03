import { createRoot } from "react-dom/client";
import { App } from "./App";
import React, { StrictMode } from "react";
import { Provider } from "react-redux";
import store from "./lib/reduxStore";

const app = document.getElementById("app");

createRoot(app).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
