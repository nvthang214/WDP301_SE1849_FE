import { Input } from "antd";
import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/Logo/logosvg.svg";
import ROUTE_META from "../../../router/ROUTER_META.js";
import ROUTER from "../../../router/ROUTER.js";

const navItems = [
  { label: ROUTE_META[ROUTER.HOME].breadcrumb, path: ROUTER.HOME },
  { label: ROUTE_META[ROUTER.JOB_LIST].breadcrumb, path: ROUTER.JOB_LIST },
];

const HeaderMain = ({ className }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="hidden border-b border-neutral-100 bg-neutral-100 text-xs text-neutral-500 lg:block">
        <div className={`flex items-center justify-between py-3 px-4 ${className}`}>
          <div className="flex items-center gap-6">
            {navItems.map((item) => (
              <Link key={item.label} to={item.path} className="transition hover:text-primary-600">
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary-600" />
              +84-377-591-418
            </span>
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary-600" />
              support@jobpilot.com
            </span>
          </div>
        </div>
      </div>

      <div className={`flex items-center justify-between py-3 px-4 ${className}`}>
        <div className="flex items-center gap-10">
          <Link to={ROUTER.HOME} className="flex items-center gap-2">
            <img src={logo} alt="Jobpilot" className="h-9 w-auto" />
            <span className="text-2xl font-semibold">Jobpilot</span>
          </Link>
        </div>
        <form className="hidden flex-1 items-center justify-center xl:flex">
          <div className="relative w-full max-w-2xl">
            <Input.Search
              placeholder="Search jobs, companies..."
              allowClear
              onSearch={() => console.log("ạksndljkasdbn")}
              size="large"
              className="rounded-full w-full"
            />
          </div>
        </form>

        <div className="hidden items-center gap-3 xl:flex">
          <Link
            to={ROUTER.LOGIN}
            className="rounded-md border border-primary-600 px-5 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-50"
          >
            Sign In
          </Link>
          <Link
            to={ROUTER.JOB_POST}
            className="rounded-md bg-primary-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
          >
            Post A Jobs
          </Link>
        </div>
      </div>
    </header>
  );
};

export default HeaderMain;
