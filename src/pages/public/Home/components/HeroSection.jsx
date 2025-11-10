import { SearchOutlined, EnvironmentOutlined } from "@ant-design/icons";
import icon1 from "../../../../assets/images/Home/hero_icon/Icon.svg";
import icon2 from "../../../../assets/images/Home/hero_icon/Icon-1.svg";
import icon3 from "../../../../assets/images/Home/hero_icon/Icon-2.svg";
import icon4 from "../../../../assets/images/Home/hero_icon/Icon-3.svg";
import CountUp from "react-countup";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPublicStats } from "../../../../services/PublicService/index.js";
import ROUTER from "../../../../router/ROUTER.js";

const HeroSection = () => {
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue && searchValue.trim()) {
      navigate(`${ROUTER.JOB_LIST}?search=${encodeURIComponent(searchValue.trim())}`);
    } else {
      navigate(ROUTER.JOB_LIST);
    }
  };
  const [stats, setStats] = useState({
    liveJobs: 0,
    companies: 0,
    candidates: 0,
    newJobs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const data = await fetchPublicStats();
        setStats({
          liveJobs: data.liveJobs || 0,
          companies: data.companies || 0,
          candidates: data.candidates || 0,
          newJobs: data.newJobs || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Use default values on error
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <section className="mt-5 mb-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 lg:flex-row">
        {/* Left content */}
        <div className="flex-5 space-y-6">
          <div className="text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
            Find a job that suits your interest & skills.
          </div>
          <p className="mt-4 max-w-2xl text-lg text-gray-500">
            Explore thousands of job listings from top companies and find the one that fits you
            best.
          </p>

          {/* Search bar */}
          <form
            className="mt-8 flex flex-col items-center gap-2 rounded-md border border-neutral-200 bg-white p-3 shadow-lg md:flex-row"
            onSubmit={handleSearch}
          >
            <div className="flex w-full flex-1 items-center gap-2 rounded-md border border-transparent px-3 py-2 transition-all">
              <SearchOutlined className="!text-primary text-lg" />
              <input
                type="text"
                placeholder="Job title, keyword..."
                className="w-full outline-none"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer rounded-sm bg-blue-600 px-6 py-3 font-semibold !text-white shadow-md transition-all hover:bg-blue-700 md:w-auto"
            >
              Find Job
            </button>
          </form>
        </div>

        {/* Right Illustration */}
        <div className="flex flex-4 justify-center">
          <img
            src="https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif"
            alt="Illustration"
            className="h-auto w-full rounded-lg object-contain"
          />
        </div>
      </div>
      {/* Stats */}
      {!loading && (
        <div className="mt-16 grid grid-cols-2 gap-14 sm:grid-cols-4">
          {[
            { label: "Live Job", value: stats.liveJobs, urlIcon: icon1 },
            { label: "Companies", value: stats.companies, urlIcon: icon2 },
            { label: "Candidates", value: stats.candidates, urlIcon: icon3 },
            { label: "New Jobs", value: stats.newJobs, urlIcon: icon4 },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-5 rounded-md bg-white p-4 shadow-md">
              <div>
                <img src={item.urlIcon} alt="Icon" />
              </div>
              <div>
                <div className="text-2xl text-gray-900">
                  <CountUp end={item.value} separator="," />
                </div>
                <div className="mt-1 text-sm text-gray-500">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;
