import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CloudUpload,
  Code,
  Database,
  DollarSign,
  FileText,
  Hospital,
  MapPin,
  Megaphone,
  Music,
  PenTool,
  Star,
  Target,
  Users2,
  Video,
} from "lucide-react";
import { createElement, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ROUTER from "../../../router/ROUTER";
import HeroSection from "./components/HeroSection";
import JobCard from "../../../components/Card/JobCard";
import { notifyError } from "../../../components/Notification";
import CompanyCard from "../../../components/Card/CompanyCard";
import { CompanyService } from "../../../services/CompanyService";
import { CategoryService } from "../../../services/CategoryService";
import { fetchTopAppliedJobs } from "../../../services/PublicService";

const vacancyList = [
  { title: "Anesthesiologists", openings: "45,004" },
  { title: "Surgeons", openings: "50,364" },
  { title: "Obstetricians-Gynecologists", openings: "4,339" },
  { title: "Orthodontists", openings: "20,079" },
  { title: "Maxillofacial Surgeons", openings: "74,875" },
  { title: "Software Developer", openings: "43,359" },
  { title: "Psychiatrists", openings: "18,590" },
  { title: "Data Scientist", openings: "26,309" },
  { title: "Financial Manager", openings: "61,321" },
  { title: "Management Analyst", openings: "93,045" },
  { title: "IT Manager", openings: "59,089" },
  { title: "Operations Research Analyst", openings: "18,627" },
];

const processSteps = [
  {
    title: "Create account",
    description:
      "Sign up in a few easy steps to start your job search journey and access personalized recommendations.",
    icon: Users2,
  },
  {
    title: "Upload CV/Resume",
    description:
      "Upload your latest resume to let top employers discover your skills and experience easily.",
    icon: CloudUpload,
    highlight: true,
  },
  {
    title: "Find suitable job",
    description:
      "Browse thousands of verified listings and discover opportunities that match your goals and passion.",
    icon: Target,
  },
  {
    title: "Apply job",
    description:
      "Submit your application, connect with employers, and take the next step in your career.",
    icon: CheckCircle2,
  },
];

// const popularCategories = [
//   { label: "Graphics & Design", openings: 357, icon: <PenTool /> },
//   { label: "Code & Programming", openings: 312, icon: <Code /> },
//   { label: "Digital Marketing", openings: 297, icon: <Megaphone /> },
//   { label: "Video & Animation", openings: 247, icon: <Video /> },
//   { label: "Music & Audio", openings: 204, icon: <Music /> },
//   { label: "Account & Finance", openings: 167, icon: <DollarSign /> },
//   { label: "Health & Care", openings: 125, icon: <Hospital /> },
//   { label: "Data & Science", openings: 57, featured: true, icon: <Database /> },
// ];

const formatJobType = (type) => {
  if (!type) return "N/A";
  return type.toString().replace(/[_-]/g, " ").toUpperCase();
};

const formatSalaryRange = (job) => {
  if (!job) return "Negotiable";

  const formatValue = (value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return null;
    return `$${numeric.toLocaleString()}`;
  };

  const { minSalary, maxSalary, salaryType } = job;
  const suffix = salaryType ? `/${salaryType.toString().toLowerCase()}` : "";

  const minLabel = formatValue(minSalary);
  const maxLabel = formatValue(maxSalary);

  if (minLabel && maxLabel) return `${minLabel} - ${maxLabel}${suffix}`;
  if (minLabel) return `${minLabel}+${suffix}`;
  if (maxLabel) return `Up to ${maxLabel}${suffix}`;

  return "Negotiable";
};

const formatLocation = (job) => {
  if (!job) return "Địa điểm đang cập nhật";
  if (job.location) return job.location;

  const parts = [job.city, job.country]
    .map((part) => (typeof part === "string" ? part.trim() : ""))
    .filter(Boolean);

  if (parts.length) return parts.join(", ");

  return job.remote ? "Remote" : "Địa điểm đang cập nhật";
};

const topCompanies = [
  {
    name: "IT Manager",
    location: "Hanoi, Vietnam",
    openings: 3,
    logo: "data:image/png;base64,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",
  },
  {
    name: "IT Manager",
    location: "Hanoi, Vietnam",
    openings: 3,
    logo: "data:image/png;base64,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",
  },
  {
    name: "IT Manager",
    location: "Hanoi, Vietnam",
    openings: 3,
    logo: "data:image/png;base64,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",
  },
  {
    name: "IT Manager",
    location: "Hanoi, Vietnam",
    openings: 3,
    logo: "data:image/png;base64,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",
  },
  {
    name: "IT Manager",
    location: "Hanoi, Vietnam",
    openings: 3,
    logo: "data:image/png;base64,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",
  },
  {
    name: "IT Manager",
    location: "Hanoi, Vietnam",
    openings: 3,
    logo: "data:image/png;base64,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",
  },
];

const testimonials = [
  {
    name: "Robert Fox",
    role: "UI/UX Designer",
    quote:
      "Ut ullamcorper hendrerit tempor. Aliquam in rutrum dui. Maecenas ac placerat metus, in faucibus est.",
  },
  {
    name: "Bessie Cooper",
    role: "Creative Director",
    quote:
      "Mauris eget lorem odio. Mauris convallis justo molestie metus aliquam lacinia. Suspendisse ut volutpat augue.",
  },
  {
    name: "Jane Cooper",
    role: "Photographer",
    quote:
      "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
  },
];

const dualCtas = [
  {
    title: "Become a Candidate",
    description: "Find jobs that match your interest and skills in a few minutes.",
    action: "Register Now",
    tone: "light",
  },
  {
    title: "Become an Employer",
    description: "Post jobs quickly and manage candidates in one dashboard.",
    action: "Register Now",
    tone: "dark",
  },
];

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [isLoadingFeaturedJobs, setIsLoadingFeaturedJobs] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [companiesError, setCompaniesError] = useState(null);
  const companiesToRender = companies.length ? companies : topCompanies;

  useEffect(() => {
    let ignore = false;

    const fetchFeaturedJobs = async () => {
      setIsLoadingFeaturedJobs(true);

      try {
        const response = await fetchTopAppliedJobs();

        if (ignore) return;

        const data = Array.isArray(response) ? response : [];
        setFeaturedJobs(data);
      } catch (error) {
        if (ignore) return;

        console.error(error);
        notifyError(error?.message || "Không thể tải danh sách công việc nổi bật.");
        setFeaturedJobs([]);
      } finally {
        if (!ignore) setIsLoadingFeaturedJobs(false);
      }
    };

    fetchFeaturedJobs();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    const fetchTopCompanies = async () => {
      setIsLoadingCompanies(true);
      setCompaniesError(null);

      try {
        const response = await CompanyService.getCompanies({ limit: 6, hasOpenings: true });

        if (ignore) return;

        if (response?.isError) {
          throw new Error(response?.msg || "Không thể tải danh sách công ty.");
        }

        const data = Array.isArray(response?.data?.companies)
          ? response.data.companies
          : Array.isArray(response?.data)
            ? response.data
            : [];

        // Không set error nếu không có companies - đây là trường hợp bình thường
        setCompanies(data);
      } catch (error) {
        if (ignore) return;

        // Chỉ set error nếu là lỗi thực sự (không phải empty result)
        const isNotFoundError =
          error?.response?.status === 404 || error?.message?.includes("No companies found");

        if (!isNotFoundError) {
          console.error(error);
          setCompaniesError(error?.message || "Không thể tải danh sách công ty.");
        }
        setCompanies([]);
      } finally {
        if (!ignore) setIsLoadingCompanies(false);
      }
    };

    fetchTopCompanies();

    return () => {
      ignore = true;
    };
  }, []);

  const [popularCategories, setPopularCategories] = useState([]);

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchPopularCategories = async () => {
      const res = await CategoryService.getPopularCategories();
      setPopularCategories(res.data || []);
    };

    fetchPopularCategories();
  }, []);

  return (
    <div className="space-y-20">
      <HeroSection />

      {/* <section className="mx-auto max-w-7xl rounded-lg bg-neutral-100 px-10 pt-10 pb-20">
        <header className="space-y-2">
          <p className="text-primary text-2xl font-semibold tracking-wider uppercase">
            Most Popular Vacancies
          </p>
        </header>
        <div className="mt-8 grid gap-6 text-neutral-600 sm:grid-cols-2 lg:grid-cols-3">
          {vacancyList.map(({ title, openings }) => (
            <div
              key={title}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <div className="text-lg font-semibold text-neutral-900">{title}</div>
              <p className="mt-2 text-sm text-neutral-500">{openings} open positions</p>
            </div>
          ))}
        </div>
      </section> */}

      <section className="">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <header className="text-center">
            <p className="text-primary-600 text-2xl font-semibold tracking-wider uppercase">
              How Jobpilot Works
            </p>
          </header>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map(({ title, description, icon, highlight }, index) => (
              <div
                key={title}
                className={`relative rounded-3xl border bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${
                  highlight ? "border-primary-200 bg-primary-50" : "border-neutral-100"
                }`}
              >
                <div
                  className={`mb-6 inline-flex rounded-full p-3 ${highlight ? "bg-white" : "bg-primary-50"}`}
                >
                  {createElement(icon, {
                    className: `h-6 w-6 ${highlight ? "text-primary-600" : "text-primary-500"}`,
                  })}
                </div>
                <div className="text-sm font-semibold text-neutral-400">Step {index + 1}</div>
                <h3 className="mt-2 text-xl font-semibold text-neutral-900">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sm:px-6= mx-auto max-w-7xl rounded-lg bg-neutral-100 pt-10 pb-20">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-primary-600 text-2xl font-semibold tracking-wider uppercase">
            Popular Categories
          </div>
          <Link
            to="/jobs"
            className="text-primary-600 inline-flex items-center gap-2 text-sm font-semibold"
          >
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </header>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {popularCategories.map(({ label, openings }) => (
            <Link to={`/jobs?category=${encodeURIComponent(label)}`} key={label}>
              <div
                className={`flex h-full items-center justify-between gap-3 rounded-2xl border-neutral-200 bg-white px-6 py-6 text-left transition hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="bg-primary-100 text-primary rounded-md p-4">
                  <DollarSign />
                </div>
                <button key={label} type="button" className="text-start">
                  <span className="text-base font-semibold text-neutral-900">{label}</span>
                  <br />
                  <span className="mt-3 inline-flex gap-2 text-sm text-neutral-500">
                    {openings} open positions
                  </span>
                </button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="">
        <div className="mx-auto max-w-7xl">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-primary-600 text-2xl font-semibold tracking-wider uppercase">
                Featured Jobs
              </div>
            </div>
            <Link
              to="/jobs"
              className="text-primary-600 inline-flex items-center gap-2 text-sm font-semibold"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </header>

          <div className="mt-12 grid gap-6 lg:grid-cols-3 auto-rows-fr items-stretch">
            {isLoadingFeaturedJobs ? (
              <div className="text-center text-sm text-neutral-500 lg:col-span-3">
                Đang tải công việc nổi bật...
              </div>
            ) : featuredJobs.length ? (
              featuredJobs.map((job, index) => {
                const rawJobId = job?.jobId || job?._id || job?.id || null;
                const key = rawJobId || `${job?.title || "featured-job"}-${index}`;
                const companyName = job?.company?.name || "Đang cập nhật";
                const companyLogo = job?.company?.logo || undefined;
                const jobDetailPath = rawJobId
                  ? ROUTER.JOB_DETAIL.replace(":id", encodeURIComponent(rawJobId))
                  : ROUTER.JOB_LIST;

                return (
                  <Link to={jobDetailPath} key={key} className="block h-full">
                    <JobCard
                      jobId={rawJobId}
                      title={job?.title || "Đang cập nhật"}
                      type={formatJobType(job?.jobType)}
                      salary={formatSalaryRange(job)}
                      company={companyName}
                      location={formatLocation(job)}
                      logo={companyLogo}
                      totalApplicants={job?.totalApplicants ?? null}
                    />
                  </Link>
                );
              })
            ) : (
              <div className="text-center text-sm text-neutral-500 lg:col-span-3">
                Chưa có công việc nổi bật.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto mb-5 max-w-7xl">
        <header className="text-start">
          <div className="text-primary-600 text-2xl font-semibold tracking-wider uppercase">
            Top Companies
          </div>
        </header>

  <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr items-stretch">
          {isLoadingCompanies ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-neutral-200"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-neutral-200"></div>
                      <div className="h-3 w-1/2 rounded bg-neutral-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : companiesError ? (
            // Error state
            <div className="col-span-full py-8 text-center">
              <p className="text-neutral-500">{companiesError}</p>
            </div>
          ) : companies.length === 0 ? (
            // No companies found from API
            <div className="col-span-full py-8 text-center">
              <p className="text-neutral-500">Chưa có công ty nào</p>
            </div>
          ) : companiesToRender.length ? (
            companiesToRender.map((item, index) => (
              <CompanyCard
                key={item._id || item.id || `${item.name}-${index}`}
                companyId={item._id || item.id}
                name={item.name || item.companyName}
                location={item.location || item.address}
                openings={item.openings || item.jobCount || 0}
                logo={item.logo || item.companyLogo}
                companyType={item.industry || "Technology"}
                linkTo={ROUTER.COMPANY_LIST}
                {...item}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-sm text-neutral-500">
              Chưa có dữ liệu công ty.
            </div>
          )}
        </div>
      </section>

      {/* <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl">
          <header className="text-center">
            <p className="text-primary-600 text-2xl font-semibold tracking-wider uppercase">
              Clients Testimonial
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-neutral-900">
              Trusted by talent across industries
            </h2>
          </header>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map(({ name, role, quote }) => (
              <div
                key={name}
                className="flex h-full flex-col gap-6 rounded-3xl border border-neutral-100 bg-white p-8 shadow-sm"
              >
                <div className="text-primary-500 flex items-center gap-2">
                  {[...Array(5)].map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-neutral-600">“{quote}”</p>
                <div className="mt-auto">
                  <div className="text-base font-semibold text-neutral-900">{name}</div>
                  <p className="text-sm text-neutral-500">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* <section className="mx-auto max-w-7xl pb-12">
        <div className="grid gap-6 lg:grid-cols-2">
          {dualCtas.map(({ title, description, action, tone }) => (
            <div
              key={title}
              className={`relative overflow-hidden rounded-3xl p-10 shadow-lg ${
                tone === "dark"
                  ? "from-primary-400 to-primary-700 bg-gradient-to-br text-white"
                  : "bg-white text-neutral-900"
              }`}
            >
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">{title}</h3>
                <p className={`text-sm ${tone === "dark" ? "text-white/80" : "text-neutral-500"}`}>
                  {description}
                </p>
                <Link
                  to={ROUTER.REGISTER}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition ${
                    tone === "dark"
                      ? "bg-white/15 text-white hover:bg-white/25"
                      : "bg-primary-50 text-primary-600 hover:bg-primary-100"
                  }`}
                >
                  {action}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section> */}
    </div>
  );
};

const SearchIcon = () => <FileText className="text-primary-500 h-4 w-4" />;

export default Home;
