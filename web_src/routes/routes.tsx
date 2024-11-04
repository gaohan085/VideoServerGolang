import axios, { AxiosResponse } from "axios";
import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import * as Components from "../Components";
import { type ResWithActressName } from "../Components";

const ErrorPage = lazy(() => import("./error-page"));
const IndexLayout = lazy(() => import("./index-page-layout"));
const ActressByName = lazy(() => import("./actress-by-name"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Suspense fallback={<Components.Spinner fontSize={30} />}>
          <Components.Player />

          <Outlet />
        </Suspense>
      </>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <IndexLayout />
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: "/actress/:name",
        element: (
          <ActressByName />
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
