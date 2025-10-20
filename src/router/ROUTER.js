const ROUTER = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // Job routes
  // Recruiter Job management

  JOB_POST: "/recruiter/jobs/post",
  JOB_EDIT: "/recruiter/jobs/edit/:id",
  JOB_DEACTIVATE: "/recruiter/jobs/deactivate/:id",
  // Candidate Job application
  JOBS: "/jobs",
  JOB_DETAILS: "/jobs/:id",


  // Company routes
  COMPANIES: "/recruiter/companies",
  COMPANY_DETAILS: "/recruiter/companies/:id",
  COMPANY_POST: "/recruiter/company/posting",
  COMPANY_EDIT: "/recruiter/companies/edit/:id",

  // Recruiter routes
  RECRUITER_DASHBOARD: "/recruiter/overview",
  ACCOUNT_SETTINGS: "/recruiter/account",
  COMPANY_INFO: "/recruiter/companyinfo",
  SOCIAL_MEDIA: "/recruiter/socialmedia",

  //company for candidate view
  COMPANY_INFORMATION: "/company/:id",

  // Candidate routes
  CANDIDATE_DASHBOARD: "/candidate/overview",

  // Admin routes
  ADMIN_DASHBOARD: "/admin/dashboard",
};

export default ROUTER;
