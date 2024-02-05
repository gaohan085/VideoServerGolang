import React from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

import * as Components from "../Components";

import { ErrorPage } from ".";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Components.Player />
        <Outlet />
      </>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Components.InteractiveSidebar /> },
      {
        path: "/actress/:name",
        element: <></>,
      },
    ],
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
