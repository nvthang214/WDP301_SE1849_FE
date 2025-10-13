import { Link, useRoutes } from "react-router-dom";
import LayoutCommon from "../components/Layout";

import LazyLoadingComponent from "../components/LazyLoading";
import NotFound from "../pages/public/NotFound";
import ROUTER from "./ROUTER";
import React from "react";

// react lazy imports
// const HomeMain = React.lazy(() => import("../pages/private/Home"));
const Login = React.lazy(() => import("../pages/public/Authentication/Login"));
const Register = React.lazy(() => import("../pages/public/Authentication/Register"));

const routes = [
  {
    path: ROUTER.HOME,
    element: (
      <LazyLoadingComponent>
        <Link to={ROUTER.LOGIN}>Đăng nhập</Link>
        <br />
        <Link to={ROUTER.REGISTER}>Đăng ký</Link>
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.LOGIN,
    element: (
      <LazyLoadingComponent>
        <Login />
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.REGISTER,
    element: (
      <LazyLoadingComponent>
        <Register />
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
