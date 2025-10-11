import { useRoutes } from "react-router-dom";
import LayoutCommon from "../components/Layout";

import LazyLoadingComponent from "../components/LazyLoading";
import NotFound from "../pages/public/NotFound";
import ROUTER from "./ROUTER";
import React from "react";

// react lazy imports
// const HomeMain = React.lazy(() => import("../pages/private/Home"));

// Job imports
const JobList = React.lazy(() => import("../pages/private/Job/JobList"));
const JobDetails = React.lazy(() => import("../pages/private/Job/JobDetails"));
const JobPosting = React.lazy(() => import("../pages/private/Job/JobPosting"));
const JobEditing = React.lazy(() => import("../pages/private/Job/JobEditing"));

const routes = [
  {
    path: ROUTER.HOME,
    element: (
      <LazyLoadingComponent>
        <div>Home Page</div>
      </LazyLoadingComponent>
    ),
  },
  // Job routes
  {
    path: ROUTER.JOBS,
    element: (
      <LazyLoadingComponent>
        <JobList />
      </LazyLoadingComponent>
    ),
  },{
    path: ROUTER.JOB_DETAILS,
    element: (
      <LazyLoadingComponent>
        <JobDetails />
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.JOB_POST,
    element: (
      <LazyLoadingComponent>
        <JobPosting />
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.JOB_EDIT,
    element: (
      <LazyLoadingComponent>
        <JobEditing />
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
