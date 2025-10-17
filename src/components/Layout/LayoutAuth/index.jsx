import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/Logo/logosvg.svg";
import ROUTER from "../../../router/ROUTER";
import CountUp from "react-countup";

const LayoutAuth = ({
  children,
  formFooter,
  heroTitle = "Over 175,324 candidates waiting for good employers.",
  heroSubtitle = "Xây dựng đội ngũ mơ ước của bạn bằng cách tiếp cận kho ứng viên chất lượng cao chỉ trong vài bước.",
  stats = [
    { label: "Live Jobs", value: "175324" },
    { label: "Companies", value: "97354" },
    { label: "New Jobs", value: "7532" },
  ],
  backgroundImage = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1340&q=80",
}) => {
  return (
    <div className="flex min-h-screen flex-col bg-white lg:flex-row">
      {/* Left column - form */}
      <div className="flex w-full flex-col px-6 py-10 sm:px-12 lg:w-[580px] lg:px-16">
        <Link
          to={ROUTER.HOME}
          className="flex items-center gap-3 text-lg font-semibold text-neutral-900"
        >
          <img src={logo} alt="Jobpilot" className="h-10 w-auto" />
          <span className="hidden text-xl font-semibold lg:inline">Jobpilot</span>
        </Link>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col pt-10">
          <div className="flex-1">{children}</div>
        </div>
        {formFooter && <div>{formFooter}</div>}
      </div>

      {/* Right column - hero */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden lg:flex">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(8,31,74,0.85) 0%, rgba(2,12,32,0.9) 100%), url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-10 flex max-w-xl flex-col gap-12 px-12">
          <div className="space-y-6 text-white">
            <h2 className="text-4xl font-semibold leading-tight">{heroTitle}</h2>
            <p className="text-base text-white/80">{heroSubtitle}</p>
          </div>

          <div className="grid grid-cols-3 gap-6 text-white/90">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
              >
                <div className="text-2xl font-semibold">
                  <CountUp end={item.value} separator="," />
                </div>
                <div className="mt-2 text-sm text-white/70">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

LayoutAuth.propTypes = {
  children: PropTypes.node.isRequired,
  formFooter: PropTypes.node,
  heroTitle: PropTypes.string,
  heroSubtitle: PropTypes.string,
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  backgroundImage: PropTypes.string,
};

export default LayoutAuth;
