import React from "react";
import { createBrowserRouter } from "react-router-dom";
import LazyLoad from "../components/LazyLoad";
import NotFound from "../pages/public/NotFound";
import ROUTER from "./ROUTER.js";
import ROUTE_META from "./ROUTER_META.js";

// react lazy imports
const HomePage = React.lazy(() => import("../pages/public/Home"));
const Login = React.lazy(() => import("../pages/public/Authentication/Login"));
const Register = React.lazy(() => import("../pages/public/Authentication/Register"));
const ForgotPassword = React.lazy(() => import("../pages/public/Authentication/ForgotPassword"));
const ResetPassword = React.lazy(() => import("../pages/public/Authentication/ResetPassword"));
const AccountSettings = React.lazy(() => import("../pages/private/Recruiter/RecruiterSetting/AccountSetting"));
const CompanyInfo = React.lazy(() => import("../pages/private/Recruiter/RecruiterSetting/CompanyInfo"));
const SocialMedia = React.lazy(() => import("../pages/private/Recruiter/RecruiterSetting/SocialMedia"));
const LayoutDashboard = React.lazy(() => import("../components/Layout/LayoutRecruiter"));
const RecruiterOverview = React.lazy(() => import("../pages/private/Recruiter"));

const JobList = React.lazy(() => import("../pages/private/Job/JobList"));
const JobDetails = React.lazy(() => import("../pages/private/Job/JobDetails"));
const JobPosting = React.lazy(() => import("../pages/private/Job/JobPosting"));
const JobEditing = React.lazy(() => import("../pages/private/Job/JobEditing"));

const CompanyPosting = React.lazy(() => import("../pages/private/Company/CompanyPosting"));
const CompanyList = React.lazy(() => import("../pages/private/Company/CompanyList"));
const CompanyUpdate = React.lazy(() => import("../pages/private/Company/CompanyUpdate"));
const CompanyInformation = React.lazy(() => import("../pages/private/Company/CompanyInformation"));

const CandidateOverview = React.lazy(() => import("../pages/private/Candidate"));

const LayoutAuth = React.lazy(() => import("../components/Layout/LayoutAuth"));
const LayoutCommon = React.lazy(() => import("../components/Layout"));
const LayoutRecruiter = React.lazy(() => import("../components/Layout/LayoutRecruiter"));
const LayoutCandidate = React.lazy(() => import("../components/Layout/LayoutCandidate"));
const LayoutAdmin = React.lazy(() => import("../components/Layout/LayoutAdmin"));
/**
 * --- Routes config ---
 * loader: kiểm tra điều kiện trước khi vào route
 * handle: meta data của route- yêu cầu auth, title, breadcrumb, ...
 */
const router = createBrowserRouter([
  // --- Authentication routes ---
  {
    element: <LayoutAuth />,
    loader: () => null,
    children: [
      {
        path: ROUTER.LOGIN,
        element: (
          <LazyLoad>
            <Login />
          </LazyLoad>
        ),
        handle: ROUTE_META[ROUTER.LOGIN],
      },
      {
        path: ROUTER.REGISTER,
        element: (
          <LazyLoad>
            <Register />
          </LazyLoad>
        ),
        handle: ROUTE_META[ROUTER.REGISTER],
      },
      {
        path: ROUTER.FORGOT_PASSWORD,
        element: (
          <LazyLoad>
            <ForgotPassword />
          </LazyLoad>
        ),
        handle: ROUTE_META[ROUTER.FORGOT_PASSWORD],
      },
      {
        path: ROUTER.RESET_PASSWORD,
        element: (
          <LazyLoad>
            <ResetPassword />
          </LazyLoad>
        ),
        handle: ROUTE_META[ROUTER.RESET_PASSWORD],
      },
    ],
  },

  // --- Public routes ---
  {
    element: <LayoutCommon />,
    handle: { breadcrumb: ROUTE_META[ROUTER.HOME]?.breadcrumb },
    children: [
      {
        index: true,
        path: ROUTER.HOME,
        element: (
          <LazyLoad>
            <HomePage />
          </LazyLoad>
        ),
      },
      {
        path: ROUTER.JOBS,
        element: (
          <LazyLoad>
            <JobList />
          </LazyLoad>
        ),
        handle: ROUTE_META[ROUTER.JOBS],
      },
    ],
  },

  // --- Candidate routes ---

  {
    element: <LayoutCandidate />,
    children: [
      {
        path: ROUTER.CANDIDATE_DASHBOARD,
        element: (
          <LazyLoad>
            <CandidateOverview />
          </LazyLoad>
        ),
        handle: ROUTE_META[ROUTER.CANDIDATE_DASHBOARD],
      },
    ],
  },

  // --- Admin routes ---

  {
    element: <LayoutAdmin />,
    children: [
      {
        path: ROUTER.ADMIN_DASHBOARD,
        element: (
          <LazyLoad>
            <div>Admin Dashboard</div>
          </LazyLoad>
        ),
        handle: ROUTE_META[ROUTER.ADMIN_DASHBOARD],
      },
    ],
  },

  // --- Job routes ---

  {
    path: ROUTER.JOB_DETAILS,
    element: (
      <LazyLoad>
        <JobDetails />
      </LazyLoad>
    ),
  },
  {
    path: ROUTER.JOB_POST,
    element: (
      <LazyLoad>
        <LayoutDashboard>
          <JobPosting />
        </LayoutDashboard>
      </LazyLoad>
    ),
  },
  {
    path: ROUTER.JOB_EDIT,
    element: (
      <LazyLoad>
        <LayoutDashboard>
          <JobEditing />
        </LayoutDashboard>
      </LazyLoad>
    ),
  },

  // --- Company routes ---
  {
    path: ROUTER.COMPANIES,
    element: (
      <LazyLoad>
        <CompanyList />
      </LazyLoad>
    ),
  },
  {
    path: ROUTER.COMPANY_POST,
    element: (
      <LazyLoad>
        <CompanyPosting />
      </LazyLoad>
    ),
  },
  {
    path: ROUTER.COMPANY_EDIT,
    element: (
      <LazyLoad>
        <CompanyUpdate />
      </LazyLoad>
    ),
  },
  {
    path: ROUTER.COMPANY_INFORMATION,
    element: (
      <LazyLoad>
        <CompanyInformation />
      </LazyLoad>
    ),
  },

  // --- Recruiter routes---
  {
    element: <LayoutRecruiter />,
    handle: {breadcrumb: ROUTE_META[ROUTER.RECRUITER_DASHBOARD]?.breadcrumb},
    children: [
      {
        path: ROUTER.RECRUITER_DASHBOARD,
        element: (
          <LazyLoad>
            <RecruiterOverview />
          </LazyLoad>
        ),
        handle: ROUTE_META[ROUTER.RECRUITER_DASHBOARD],
      },
    ],
  },
  {
    element: <LayoutRecruiter />,
    handle: {breadcrumb: ROUTE_META[ROUTER.ACCOUNT_SETTINGS]?.breadcrumb},
    children: [
      {
        path: ROUTER.ACCOUNT_SETTINGS,
        element: (
          <LazyLoad>
            <AccountSettings />
          </LazyLoad>
        ),
        handle: ROUTE_META[ROUTER.ACCOUNT_SETTINGS],
      },
    ],
  },
  {
    element: <LayoutRecruiter />,
    handle: {breadcrumb: ROUTE_META[ROUTER.COMPANY_INFO]?.breadcrumb},
    children: [
      {
        path: ROUTER.COMPANY_INFO,
        element: (
          <LazyLoad>
            <CompanyInfo />
          </LazyLoad>
        ),
        handle: ROUTE_META[ROUTER.COMPANY_INFO],
      },
    ],
  },
  {
    element: <LayoutRecruiter />,
    handle: {breadcrumb: ROUTE_META[ROUTER.SOCIAL_MEDIA]?.breadcrumb},
    children: [
      {
        path: ROUTER.SOCIAL_MEDIA,
        element: (
          <LazyLoad>
            <SocialMedia />
          </LazyLoad>
        ),
        handle: ROUTE_META[ROUTER.SOCIAL_MEDIA],
      },
    ],
  },

  // --- 404 ---
  {
    path: "*",
    element: (
      <LazyLoad>
        <NotFound />
      </LazyLoad>
    ),
  },
]);

export default router;
