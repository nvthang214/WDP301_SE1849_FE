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
  // ========================= End public routes =======================

  //////////////////////////////////////////////////////////////////////

  // ========================= Private routes ==========================
  // --- Recruiter routes ---
  [ROUTER.RECRUITER_OVERVIEW]: {
    breadcrumb: "Overview",
    title: "Recruiter Overview",
  },

  // --- Candidate routes ---
  [ROUTER.CANDIDATE_OVERVIEW]: {
    breadcrumb: "Overview",
    title: "Candidate Overview",
  },
  [ROUTER.CANDIDATE_PROFILE]: {
    breadcrumb: "Profile",
    title: "Candidate Profile",
  },
  [ROUTER.CANDIDATE_SOCIAL]: {
    breadcrumb: "Social",
    title: "Candidate Social",
  },

  // --- Admin routes ---
  [ROUTER.ADMIN_OVERVIEW]: {
    breadcrumb: "Overview",
    title: "Admin Overview",
  },
};

export default ROUTE_META;
