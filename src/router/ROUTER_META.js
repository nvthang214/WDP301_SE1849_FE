import ROUTER from "./ROUTER";

const ROUTE_META = {
  // Authentication routes
  [ROUTER.LOGIN]: {
    breadcrumb: "Đăng nhập",
    title: "Login",
  },
  [ROUTER.REGISTER]: {
    breadcrumb: "Đăng ký",
    title: "Register",
  },

  // Public routes
  [ROUTER.HOME]: {
    breadcrumb: "Home",
    title: "Home",
  },
  [ROUTER.JOBS]: {
    breadcrumb: "Job List",
    title: "Jobs",
  },

  // Private routes
  [ROUTER.DASHBOARD]: {
    breadcrumb: "Bảng điều khiển",
    title: "Dashboard",
    requiresAuth: true,
  },

  [ROUTER.JOB_DETAILS]: {
    breadcrumb: "Chi tiết việc làm",
    title: "Job Details",
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
  [ROUTER.ADMIN_DASHBOARD]: {
    breadcrumb: "Overview",
    title: "Overview",
    requiresAuth: true,
  },
};

export default ROUTE_META;
