import { Link, useRoutes } from "react-router-dom";
import LayoutCommon from "../components/Layout";
import LazyLoadingComponent from "../components/LazyLoading";
import NotFound from "../pages/public/NotFound";
import ROUTER from "./ROUTER";
import React from "react";

// react lazy imports
const HomePage = React.lazy(() => import("../pages/public/Home"));
const Login = React.lazy(() => import("../pages/public/Authentication/Login"));
const Register = React.lazy(() => import("../pages/public/Authentication/Register"));
const ForgotPassword = React.lazy(() => import("../pages/public/Authentication/ForgotPassword"));
const ResetPassword = React.lazy(() => import("../pages/public/Authentication/ResetPassword"));
const AccountSettings = React.lazy(() => import("../pages/private/Dashboard/AccountSetting"));
const CompanyInfo = React.lazy(() => import("../pages/private/Dashboard/CompanyInfo"));
const SocialMedia = React.lazy(() => import("../pages/private/Dashboard/SocialMedia"));
const LayoutDashboard = React.lazy(() => import("../components/Layout/RecruiterLayout"));

const JobList = React.lazy(() => import("../pages/private/Job/JobList"));
const JobDetails = React.lazy(() => import("../pages/private/Job/JobDetails"));
const JobPosting = React.lazy(() => import("../pages/private/Job/JobPosting"));
const JobEditing = React.lazy(() => import("../pages/private/Job/JobEditing"));
const MyJob = React.lazy(() => import("../pages/private/Job/MyJob"));

const CompanyPosting = React.lazy(() => import("../pages/private/Company/CompanyPosting"));
const CompanyList = React.lazy(() => import("../pages/private/Company/CompanyList"));
const CompanyUpdate = React.lazy(() => import("../pages/private/Company/CompanyUpdate"));
const CompanyInformation = React.lazy(() => import("../pages/private/Company/CompanyInformation"));

// --- Routes config ---
const routes = [
  {
    path: ROUTER.HOME,
    element: (
      <LazyLoadingComponent>
        <HomePage />
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

  // --- Job routes ---
  {
    path: ROUTER.FORGOT_PASSWORD,
    element: (
      <LazyLoadingComponent>
        <ForgotPassword />
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.RESET_PASSWORD,
    element: (
      <LazyLoadingComponent>
        <ResetPassword />
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
  },
  {
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
        <LayoutDashboard>
          <JobPosting />
        </LayoutDashboard>
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.JOB_EDIT,
    element: (
      <LazyLoadingComponent>
        <LayoutDashboard>
          <JobEditing />
        </LayoutDashboard>
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.MY_JOBS,
    element: (
      <LazyLoadingComponent>
        <LayoutDashboard>
          <MyJob />
        </LayoutDashboard>
      </LazyLoadingComponent>
    ),
  },

  // --- Company routes ---
  {
    path: ROUTER.COMPANIES,
    element: (
      <LazyLoadingComponent>
        <CompanyList />
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.COMPANY_POST,
    element: (
      <LazyLoadingComponent>
        <CompanyPosting />
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.COMPANY_EDIT,
    element: (
      <LazyLoadingComponent>
        <CompanyUpdate />
      </LazyLoadingComponent>
    ),
  },
  {
    path: ROUTER.COMPANY_INFORMATION,
    element: (
      <LazyLoadingComponent>
        <CompanyInformation />
      </LazyLoadingComponent>
    ),
  },

  // --- Recruiter dashboard with layout ---
  {
    path: "/recruiter",
    element: (
      <LazyLoadingComponent>
        <LayoutDashboard />
      </LazyLoadingComponent>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <LazyLoadingComponent>
            <div>Dashboard Recruiter</div>
          </LazyLoadingComponent>
        ),
      },
      {
        path: "account-settings",
        element: (
          <LazyLoadingComponent>
            <AccountSettings />
          </LazyLoadingComponent>
        ),
      },
      {
        path: "company-info",
        element: (
          <LazyLoadingComponent>
            <CompanyInfo />
          </LazyLoadingComponent>
        ),
      },
      {
        path: "social-media",
        element: (
          <LazyLoadingComponent>
            <SocialMedia />
          </LazyLoadingComponent>
        ),
      },
    ],
  },

  // --- 404 ---
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
