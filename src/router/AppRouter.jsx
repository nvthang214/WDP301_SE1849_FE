import { useRoutes } from "react-router-dom";
import LayoutCommon from "../components/Layout";

import LazyLoadingComponent from "../components/LazyLoading";
import NotFound from "../pages/public/NotFound";
import ROUTER from "./ROUTER";
import React from "react";

// react lazy imports
// const HomeMain = React.lazy(() => import("../pages/private/Home"));
const AppliedJobs = React.lazy(() => import("../pages/private/AppliedJobs"));

const routes = [
  {
    path: ROUTER.HOME,
    element: (
      <LazyLoadingComponent>
        <div>Home Page</div>
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.APPLIED_JOBS,
    element: (
      <LazyLoadingComponent>
        <AppliedJobs />
      </LazyLoadingComponent>
    ),
  },
  {
    path: "*",
    element: (
      <LazyLoadingComponent>
        <NotFound />
      </LazyLoadingComponent>
    ),
  },
];

const AppRouter = () => {
  const renderRouter = useRoutes(routes);
  return <LayoutCommon>{renderRouter}</LayoutCommon>;
};

export default AppRouter;
