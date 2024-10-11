import axios, { AxiosResponse } from "axios";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import React from "react";

import { type ResWithActressName } from "../Components";
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
      {
        index: true,
        element: (
          <Components.WebSocketLayer>
            <Components.InteractiveFileSysSideBar />
          </Components.WebSocketLayer>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/actress/:name",
        element: (
          <Components.WebSocketLayer>
            <Components.VideoBoxes />
          </Components.WebSocketLayer>
        ),
        loader: async ({ params }) => {
          const data = (
            await axios.get<AxiosResponse<ResWithActressName>>(
              `/api/actress/${params.name}`,
            )
          ).data;
          return data;
        },
        errorElement: <ErrorPage />,
      },
    ],
  },
]);

export const Routes = () => {
  return <RouterProvider router={router} />;
};
