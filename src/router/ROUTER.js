const ROUTER = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  // Job routes
  JOBS: "/jobs",
  JOB_DETAILS: "/jobs/:id",
  JOB_POST: "/jobs/post",
  JOB_EDIT: "/jobs/edit/:id",
  JOB_DEACTIVATE: "/jobs/deactivate/:id",

  //dashboard recruiter
  DASHBOARD: "/recruiter/dashboard",
  // Account settings routes
  ACCOUNT_SETTINGS: "/recruiter/account-settings",
  //company info
  COMPANY_INFO: "/recruiter/company-info",
  //social media
  SOCIAL_MEDIA: "/recruiter/social-media",  

  // Company routes
  COMPANIES: "/recruiter/companies",
  COMPANY_DETAILS: "/recruiter/companies/:id",
  COMPANY_POST: "/recruiter/company/posting",
  COMPANY_EDIT: "/recruiter/companies/edit/:id",

  // Recruiter routes
  RECRUITER_DASHBOARD: "/recruiter/dashboard",
  //company for candidate view
  COMPANY_INFORMATION: "/company/:id",
};

export default ROUTER;
