import ROUTER from "./ROUTER";

const ROUTE_META = {
  // ========================= Public routes =========================
  // --- Authentication routes ---
  [ROUTER.LOGIN]: {
    breadcrumb: "Login",
    title: "Login",
  },
  [ROUTER.REGISTER]: {
    breadcrumb: "Register",
    title: "Register",
  },

  //--- Other public routes ---
  [ROUTER.HOME]: {
    breadcrumb: "Home",
    title: "Home",
  },

  // Job routes
  [ROUTER.JOB_LIST]: {
    breadcrumb: "Find Jobs",
    title: "Job Listings",
  },
  [ROUTER.JOB_DETAIL]: {
    breadcrumb: "Job Detail",
    title: "Job Detail",
  },
  // ========================= End public routes =======================

  //////////////////////////////////////////////////////////////////////

  // ========================= Private routes ==========================
  // --- Recruiter routes ---
  [ROUTER.RECRUITER_OVERVIEW]: {
    breadcrumb: "Overview",
    title: "Recruiter Overview",
  },
  [ROUTER.RECRUITER_MY_JOBS]: {
    breadcrumb: "My Jobs",
    title: "My Jobs",
  },
  [ROUTER.RECRUITER_JOB_POSTING]: {
    breadcrumb: "Job Posting",
    title: "Job Posting",
  },
  [ROUTER.RECRUITER_JOB_EDITING]: {
    breadcrumb: "Job Editing",
    title: "Job Editing",
  },

  // --- Candidate routes ---
  [ROUTER.CANDIDATE_OVERVIEW]: {
    breadcrumb: "Overview",
    title: "Candidate Overview",
  },

  // --- Admin routes ---
  [ROUTER.ADMIN_OVERVIEW]: {
    breadcrumb: "Overview",
    title: "Admin Overview",
  },
};

export default ROUTE_META;
