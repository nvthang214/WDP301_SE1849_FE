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

  
  //dashboard recruiter
  DASHBOARD: "/recruiter/dashboard",
  // Account settings routes
  ACCOUNT_SETTINGS: "/recruiter/account-settings",
  //company info
  COMPANY_INFO: "/recruiter/company-info",
  //social media
  SOCIAL_MEDIA: "/recruiter/social-media",  
  //my job
  MY_JOBS: "/recruiter/my-jobs",

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
