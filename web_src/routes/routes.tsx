import type { AxiosResponse } from "axios";
import axios from "axios";
import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Spinner from "../Components/spinner.tsx";
import type { ResWithActressName } from "../Components/types.tsx";

const ErrorPage = lazy(() => import("./error-page.tsx"));
const IndexLayout = lazy(() => import("./index-page-layout.tsx"));
const ActressByName = lazy(() => import("./actress-by-name.tsx"));
const LazyPlayer = lazy(() => import("../Components/player.tsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Suspense fallback={<Spinner fontSize={30} />}>
          <LazyPlayer />
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

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;