const candidate = "/candidate";
const admin = "/admin";
const recruiter = "/recruiter";

const ROUTER = {
  // ========================= Public routes =========================
  //--- Authentication routes ---
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // --- Other public routes ---

  // ========================= End public routes =======================
  // Job routes
  JOB_LIST: "/jobs",
  JOB_DETAIL: "/jobs/:id",
  //////////////////////////////////////////////////////////////////////

  // ========================= Private routes ==========================
  // --- Recruiter routes ---
  RECRUITER_OVERVIEW: `${recruiter}/overview`,
  RECRUITER_MY_JOBS: `${recruiter}/jobs/my-jobs`,
  RECRUITER_JOB_POSTING: `${recruiter}/jobs/post`,
  RECRUITER_JOB_EDITING: `${recruiter}/jobs/edit/:id`,

  // --- Candidate routes ---
  CANDIDATE_OVERVIEW: `${candidate}/overview`,
  CANDIDATE_PROFILE: `${candidate}/profile`,
  CANDIDATE_SOCIAL: `${candidate}/social`,
  CANDIDATE_APPLY_JOB: `${candidate}/applied-jobs`,
  CANDIDATE_JOB_DETAIL: `${candidate}/detail/:id`,

  // --- Admin routes ---
  ADMIN_OVERVIEW: `${admin}/overview`,
  // ========================= End private routes ======================
};

export default ROUTER;
