// src/router/AppRouter.jsx
import { useRoutes } from "react-router-dom";
import LayoutCommon from "../components/Layout";
import LazyLoadingComponent from "../components/LazyLoading";
import NotFound from "../pages/public/NotFound";
import ROUTER from "./ROUTER";
import React from "react";
import DashboardLayout from "../pages/private/dashboard/dashboardLayout.jsx";

// react lazy imports
const DashboardRecruiter = React.lazy(() => import("../pages/private/dashboard/dashboardRcruiter"));
const AccountSettings = React.lazy(() => import("../pages/private/dashboard/setting/account-setting"));
const CompanyInfo = React.lazy(() => import("../pages/private/dashboard/setting/company-info"));
const SocialMedia = React.lazy(() => import("../pages/private/dashboard/setting/social-media"));
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
  {
    path: "/recruiter",
    element: <DashboardLayout />,
    children: [
        {
            path: "dashboard",
            element: <DashboardRecruiter />,
        },
        {
            path: "account-settings",
            element: <AccountSettings />,
        },
        {
            path: "company-info",
            element: <CompanyInfo />,
        },
        {
            path: "social-media",
            element: <SocialMedia />,
        },
    ]
  },
];

const AppRouter = () => {
  const renderRouter = useRoutes(routes);
  return <LayoutCommon>{renderRouter}</LayoutCommon>;
};

export default AppRouter;