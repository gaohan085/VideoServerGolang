import axios from "axios";
import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Spinner from "../Components/spinner";
import type { ResWithActressName } from "../Components/types";
import type { AxiosResponse } from "axios";

const ErrorPage = lazy(() => import("./error-page"));
const IndexLayout = lazy(() => import("./index-page-layout"));
const ActressByName = lazy(() => import("./actress-by-name"));
const LazyPlayer = lazy(()=>import("../Components/player"));

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