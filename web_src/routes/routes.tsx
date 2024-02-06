import axios, { AxiosResponse } from "axios";
import React from "react";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";

import * as Components from "../Components";
import { type ResWithActressName } from "../Components";

import { ErrorPage } from ".";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Components.Player />
        <Components.InteractiveSideBar>
          <Outlet />
        </Components.InteractiveSideBar>
      </>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Components.InteractiveSideBarFileSys />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/actress/:name",
        element: <Components.VideoBoxes />,
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
