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
  [ROUTER.RECRUITER_MY_COMPANY]: {
    breadcrumb: "My Company",
    title: "My Company",
  },
  [ROUTER.RECRUITER_COMPANY_CREATE]: {
    breadcrumb: "Create Company",
    title: "Create Company",
  },
  [ROUTER.RECRUITER_COMPANY_EDIT]: {
    breadcrumb: "Edit Company",
    title: "Edit Company",
  },
  [ROUTER.RECRUITER_JOB_POSTING]: {
    breadcrumb: "Job Posting",
    title: "Job Posting",
  },
  [ROUTER.RECRUITER_JOB_EDITING]: {
    breadcrumb: "Job Editing",
    title: "Job Editing",
  },

  // Recruiter routes
  [ROUTER.RECRUITER_DASHBOARD]: {
    breadcrumb: "Recruiter Overview",
    title: "Recruiter Overview",
    requiresAuth: true,
  },
  [ROUTER.ACCOUNT_SETTINGS]: {
    breadcrumb: "Account Settings",
    title: "Account Settings",
    requiresAuth: true,
  },
  [ROUTER.COMPANY_INFO]: {
    breadcrumb: "Company Info",
    title: "Company Info",
    requiresAuth: true,
  },
  [ROUTER.SOCIAL_MEDIA]: {
    breadcrumb: "Social Media",
    title: "Social Media",
    requiresAuth: true,
  },
  
  // Candidate routes
  [ROUTER.CANDIDATE_DASHBOARD]: {
    breadcrumb: "Candidate Dashboard",
    title: "Candidate Dashboard",
    requiresAuth: true,
  },

  // --- Admin routes ---
  [ROUTER.ADMIN_OVERVIEW]: {
    breadcrumb: "Overview",
    title: "Admin Overview",
  },
};

export default ROUTE_META;
