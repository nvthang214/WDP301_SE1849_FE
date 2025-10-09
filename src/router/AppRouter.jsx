import { useRoutes } from "react-router-dom";
import LayoutCommon from "../components/Layout";

import LazyLoadingComponent from "../components/LazyLoading";
import NotFound from "../pages/public/NotFound";
import ROUTER from "./ROUTER";
import React from "react";

// react lazy imports
const HomeMain = React.lazy(() => import("../pages/private/Home"));

const routes = [
  {
    path: ROUTER.HOME,
    element: (
      <LazyLoadingComponent>
        <HomeMain />
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.USER_LIST,
    element: (
      <LazyLoadingComponent>
        <div>User List</div>
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.USER_LOCKED,
    element: (
      <LazyLoadingComponent>
        <div>Locked Accounts</div>
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.OPERATION_LOG,
    element: (
      <LazyLoadingComponent>
        <div>Operation Log</div>
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
