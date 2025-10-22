import React from "react";
import { createBrowserRouter } from "react-router-dom";
import LazyLoad from "../components/LazyLoad";

import ROUTER from "./ROUTER.js";
import ROUTE_META from "./ROUTER_META.js";
import NotFound from "../components/NotFound/index.jsx";
import ProtectedRoute from "../components/Authorization/ProtectedRoute.jsx";

// =========================== Layouts =============================
const LayoutAuth = React.lazy(() => import("../components/Layout/LayoutAuth"));
const LayoutCommon = React.lazy(() => import("../components/Layout"));
const LayoutCandidate = React.lazy(() => import("../components/Layout/LayoutCandidate"));
const LayoutAdmin = React.lazy(() => import("../components/Layout/LayoutAdmin"));
const AdminUserManagement = React.lazy(() => import("../pages/private/Admin/UserManagement"));
const AdminUpgradeRequests = React.lazy(() => import("../pages/private/Admin/UpgradeRequests"));
const LayoutRecruiter = React.lazy(() => import("../components/Layout/LayoutRecruiter"));
// ========================== End layouts ==========================

////////////////////////////////////////////////////////////////////

// ========================== Public pages =========================
const HomePage = React.lazy(() => import("../pages/public/Home"));
const Login = React.lazy(() => import("../pages/public/Authentication/Login"));
const Register = React.lazy(() => import("../pages/public/Authentication/Register"));
const ForgotPassword = React.lazy(() => import("../pages/public/Authentication/ForgotPassword"));
const ResetPassword = React.lazy(() => import("../pages/public/Authentication/ResetPassword"));
const JobList = React.lazy(() => import("../pages/public/Job/JobList"));
const JobDetail = React.lazy(() => import("../pages/public/Job/JobDetail"));
// ========================= End public pages ======================

////////////////////////////////////////////////////////////////////

// ========================= Candidate pages =======================
const CandidateOverview = React.lazy(() => import("../pages/private/Candidate"));
const CandidateProfile = React.lazy(() => import("../pages/private/Candidate/CandidateProfile"));
const CandidateSocial = React.lazy(() => import("../pages/private/Candidate/CandidateSocial"));
const CandidateAccount = React.lazy(() => import("../pages/private/Candidate/CandidateAccount"));
const CandidateApplyJob = React.lazy(() => import("../pages/private/Candidate/CandidateApplyJob"));
const CandidateJobDetail = React.lazy(() => import("../pages/private/Candidate/CandidateJobDetail"));
const CandidateRequestUpgrade = React.lazy(() => import("../pages/private/Candidate/RequestUpgrade"));

// ========================= End candidate pages ===================

////////////////////////////////////////////////////////////////////

// ========================= Recruiter pages =======================
const RecruiterOverview = React.lazy(() => import("../pages/private/Recruiter"));
const RecruiterMyJobs = React.lazy(() => import("../pages/private/Recruiter/Job/MyJobs"));
const RecruiterMyCompany = React.lazy(() => import("../pages/private/Recruiter/Company/MyCompany"));
const RecruiterCompanyCreate = React.lazy(
  () => import("../pages/private/Recruiter/Company/CompanyCreate")
);
const RecruiterCompanyEdit = React.lazy(
  () => import("../pages/private/Recruiter/Company/CompanyEdit")
);
const RecruiterJobPosting = React.lazy(() => import("../pages/private/Recruiter/Job/JobPosting"));
const RecruiterJobEditing = React.lazy(() => import("../pages/private/Recruiter/Job/JobEditing"));
const RecruiterSettings = React.lazy(() => import("../pages/private/Recruiter/RecruiterSetting"));

const AccountSetting = React.lazy(() => import("../pages/private/Recruiter/RecruiterSetting/AccountSetting"));
const CompanyInfo = React.lazy(() => import("../pages/private/Recruiter/RecruiterSetting/CompanyInfo"));
const SocialMedia = React.lazy(() => import("../pages/private/Recruiter/RecruiterSetting/SocialMedia"));
const router = createBrowserRouter([
  //========================= Public Routes ==========================
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

  // --- Other routes ---
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
        index: true,
        path: ROUTER.JOB_LIST,
        element: (
          <LazyLoad>
            <JobList />
          </LazyLoad>
        ),
      },
      {
        index: true,
        path: ROUTER.JOB_DETAIL,
        element: (
          <LazyLoad>
            <JobDetail />
          </LazyLoad>
        ),
      },
    ],
  },

  //======================= End public Routes ========================

  ////////////////////////////////////////////////////////////////////

  // ========================= Private routes =======================

  // --- Candidate routes ---

  {
    element: <ProtectedRoute role="candidate" />,
    children: [
      {
        element: <LayoutCandidate />,
        children: [
          {
            path: ROUTER.CANDIDATE_OVERVIEW,
            element: (
              <LazyLoad>
                <CandidateOverview />
              </LazyLoad>
            ),
            handle: ROUTE_META[ROUTER.CANDIDATE_OVERVIEW],
          },
          {
            path: ROUTER.CANDIDATE_PROFILE,
            element: (
              <LazyLoad>
                <CandidateProfile />
              </LazyLoad>
            ),
            handle: ROUTE_META[ROUTER.CANDIDATE_PROFILE],
          },
          {
            path: ROUTER.CANDIDATE_SOCIAL,
            element: (
              <LazyLoad>
                <CandidateSocial />
              </LazyLoad>
            ),
            handle: ROUTE_META[ROUTER.CANDIDATE_SOCIAL],
          },
          {
            path: ROUTER.CANDIDATE_ACCOUNT,
            element: (
              <LazyLoad>
                <CandidateAccount />
              </LazyLoad>
            ),
            handle: ROUTE_META[ROUTER.CANDIDATE_ACCOUNT],
          },
          {
            path: ROUTER.CANDIDATE_APPLY_JOB,
            element: (
              <LazyLoad>
                <CandidateApplyJob />
              </LazyLoad>
            ),
            handle: ROUTE_META[ROUTER.CANDIDATE_APPLY_JOB],
          },
          {
            path: ROUTER.CANDIDATE_JOB_DETAIL,
            element: (
              <LazyLoad>
                <CandidateJobDetail />
              </LazyLoad>
            ),
            handle: ROUTE_META[ROUTER.CANDIDATE_JOB_DETAIL],
          },
        ],
      },
      {
        path: ROUTER.CANDIDATE_REQUEST_UPGRADE,
        element: (
          <LazyLoad>
            <CandidateRequestUpgrade />
          </LazyLoad>
        ),
        handle: ROUTE_META[ROUTER.CANDIDATE_REQUEST_UPGRADE],
      },
    ],
  },
  // --- Recruiter routes ---

  {
    element: <ProtectedRoute role="recruiter" />,
    children: [
      {
        element: <LayoutRecruiter />,
        children: [
          {
            path: ROUTER.RECRUITER_OVERVIEW,
            element: (
              <LazyLoad>
                <RecruiterOverview />
              </LazyLoad>
            ),
            handle: ROUTE_META[ROUTER.RECRUITER_OVERVIEW],
          },
          {
            path: ROUTER.RECRUITER_MY_JOBS,
            element: (
              <LazyLoad>
                <RecruiterMyJobs />
              </LazyLoad>
            ),
            handle: ROUTE_META[ROUTER.RECRUITER_MY_JOBS],
          },
          {
            path: ROUTER.RECRUITER_MY_COMPANY,
            element: (
              <LazyLoad>
                <RecruiterMyCompany />
              </LazyLoad>
            ),
            handle: ROUTE_META[ROUTER.RECRUITER_MY_COMPANY],
          },
          {
            path: ROUTER.RECRUITER_COMPANY_CREATE,
            element: (
              <LazyLoad>
                <RecruiterCompanyCreate />
              </LazyLoad>
            ),
            handle: ROUTE_META[ROUTER.RECRUITER_COMPANY_CREATE],
          },
          {
            path: ROUTER.RECRUITER_COMPANY_EDIT,
            element: (
              <LazyLoad>
                <RecruiterCompanyEdit />
              </LazyLoad>
            ),
            handle: ROUTE_META[ROUTER.RECRUITER_COMPANY_EDIT],
          },
          {
            path: ROUTER.RECRUITER_JOB_POSTING,
            element: (
              <LazyLoad>
                <RecruiterJobPosting />
              </LazyLoad>
            ),
            handle: ROUTE_META[ROUTER.RECRUITER_JOB_POSTING],
          },
          {
            path: ROUTER.RECRUITER_JOB_EDITING,
            element: (
              <LazyLoad>
                <RecruiterJobEditing />
              </LazyLoad>
            ),
            handle: ROUTE_META[ROUTER.RECRUITER_JOB_EDITING],
          },
          {
            path: ROUTER.RECRUITER_SETTINGS,
            element: (
              <LazyLoad>
                <RecruiterSettings />
              </LazyLoad>
            ),
            handle: ROUTE_META[ROUTER.RECRUITER_SETTINGS],
          },
        ],
      },
    ],
  },
  // --- Admin routes ---

  {
    element: <ProtectedRoute role="admin" />,
    children: [
      {
        element: <LayoutAdmin />,
        children: [
          {
            path: ROUTER.ADMIN_OVERVIEW,
            element: (
              <LazyLoad>
                <div>Admin Dashboard</div>
              </LazyLoad>
            ),
            handle: ROUTE_META[ROUTER.ADMIN_OVERVIEW],
          },
          {
            path: ROUTER.ADMIN_USER_MANAGEMENT,
            element: (
              <LazyLoad>
                <AdminUserManagement />
              </LazyLoad>
            ),
            handle: ROUTE_META[ROUTER.ADMIN_USER_MANAGEMENT],
          },
        ],
      },
      {
        path: ROUTER.ADMIN_UPGRADE_REQUESTS,
        element: (
          <LazyLoad>
            <AdminUpgradeRequests />
          </LazyLoad>
        ),
        handle: ROUTE_META[ROUTER.ADMIN_UPGRADE_REQUESTS],
      },
    ],
  },

  //====================== End private routes =======================

  ////////////////////////////////////////////////////////////////////

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
