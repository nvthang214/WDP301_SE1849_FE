import React from "react";
import { createBrowserRouter } from "react-router-dom";
import LazyLoad from "../components/LazyLoad";
import NotFound from "../pages/public/NotFound";
import ROUTER from "./ROUTER.js";
import ROUTE_META from "./ROUTER_META.js";

/// === React lazy imports ===
// =========================== Layouts =============================
const LayoutAuth = React.lazy(() => import("../components/Layout/LayoutAuth"));
const LayoutCommon = React.lazy(() => import("../components/Layout"));
const LayoutCandidate = React.lazy(() => import("../components/Layout/LayoutCandidate"));
const LayoutAdmin = React.lazy(() => import("../components/Layout/LayoutAdmin"));
const LayoutRecruiter = React.lazy(() => import("../components/Layout/LayoutRecruiter"));
// ========================== End layouts ==========================

////////////////////////////////////////////////////////////////////

// ========================== Public pages =========================
const HomePage = React.lazy(() => import("../pages/public/Home"));
const Login = React.lazy(() => import("../pages/public/Authentication/Login"));
const Register = React.lazy(() => import("../pages/public/Authentication/Register"));
const ForgotPassword = React.lazy(() => import("../pages/public/Authentication/ForgotPassword"));
const ResetPassword = React.lazy(() => import("../pages/public/Authentication/ResetPassword"));
// ========================= End public pages ======================

////////////////////////////////////////////////////////////////////

// ========================= Candidate pages =======================
const CandidateOverview = React.lazy(() => import("../pages/private/Candidate"));
const CandidateProfile = React.lazy(() => import("../pages/private/Candidate/CandidateProfile"));
const CandidateSocial = React.lazy(() => import("../pages/private/Candidate/CandidateSocial"));
const CandidateApplyJob = React.lazy(() => import("../pages/private/Candidate/CandidateApplyJob"));
const CandidateJobDetail = React.lazy(() => import("../pages/private/Job/JobDetails"));

// ========================= End candidate pages ===================

////////////////////////////////////////////////////////////////////

// ========================= Recruiter pages =======================
const RecruiterOverview = React.lazy(() => import("../pages/private/Recruiter"));

// ========================= End Recruiter pages ===================

////////////////////////////////////////////////////////////////////

// ========================= Admin pages ===========================

// ========================= End Admin pages =======================

/**
 * --- Routes config ---
 * loader: kiểm tra điều kiện trước khi vào route
 * handle: meta data của route- yêu cầu auth, title, breadcrumb, ...
 */
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
    ],
  },

  //======================= End public Routes ========================

  ////////////////////////////////////////////////////////////////////

  // ========================= Private routes =======================

  // --- Candidate routes ---
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

  // --- Recruiter routes ---
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
    ],
  },

  // --- Admin routes ---
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
