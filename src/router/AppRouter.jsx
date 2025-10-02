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
    path: ROUTER.USER_VERIFICATION,
    element: (
      <LazyLoadingComponent>
        <div>User Verification</div>
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.USER_HIGHLIGHTED,
    element: (
      <LazyLoadingComponent>
        <div>Highlighted Users</div>
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.CONTENT_REPORTS,
    element: (
      <LazyLoadingComponent>
        <div>Content Reports</div>
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.CONTENT_BANNED_KEYWORDS,
    element: (
      <LazyLoadingComponent>
        <div>Banned Keywords</div>
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.CHAT_HISTORY,
    element: (
      <LazyLoadingComponent>
        <div>Chat History</div>
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.SERVICE_PACKAGE_LIST,
    element: (
      <LazyLoadingComponent>
        <div>Service Package List</div>
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.SERVICE_INVOICES,
    element: (
      <LazyLoadingComponent>
        <div>Service Invoices</div>
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.PROMOTION_CODES,
    element: (
      <LazyLoadingComponent>
        <div>Promotion Codes</div>
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.PAYMENT_SETTINGS,
    element: (
      <LazyLoadingComponent>
        <div>Payment Settings</div>
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.THEME_LOGO_SETTINGS,
    element: (
      <LazyLoadingComponent>
        <div>Theme & Logo Settings</div>
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.SUPPORT_REQUESTS,
    element: (
      <LazyLoadingComponent>
        <div>Support Requests</div>
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.STAFF_LIST,
    element: (
      <LazyLoadingComponent>
        <div>Staff List</div>
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.ACCESS_CONTROL,
    element: (
      <LazyLoadingComponent>
        <div>Access Control</div>
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
