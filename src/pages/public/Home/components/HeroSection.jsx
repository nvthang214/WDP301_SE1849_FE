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
    <section className="mb-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left content */}
        <div className="flex-5 space-y-6">
          <div className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            Find a job that suits your interest & skills.
          </div>
          <p className="text-gray-500 mt-4 text-lg max-w-2xl">
            Explore thousands of job listings from top companies and find the one that fits you
            best.
          </p>

          {/* Search bar */}
          <form className="mt-8 bg-white shadow-lg rounded-md border border-neutral-200 flex flex-col md:flex-row items-center p-3 gap-2" onSubmit={handleSearch}>
            <div className="flex items-center gap-2 flex-1 w-full border border-transparent transition-all rounded-md px-3 py-2">
              <SearchOutlined className="!text-primary text-lg" />
              <input
                type="text"
                placeholder="Job title, keyword..."
                className="outline-none w-full"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>

            <button type="submit" className="bg-blue-600 hover:bg-blue-700 !text-white font-semibold px-6 py-3 cursor-pointer  rounded-sm w-full md:w-auto shadow-md transition-all ">
              Find Job
            </button>
          </form>
        </div>

        {/* Right Illustration */}
        <div className="flex-4 flex justify-center">
          <img
            src="https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif"
            alt="Illustration"
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>
      </div>
      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-14 mt-16">
          {[
            { label: "Live Job", value: stats.liveJobs, urlIcon: icon1 },
            { label: "Companies", value: stats.companies, urlIcon: icon2 },
            { label: "Candidates", value: stats.candidates, urlIcon: icon3 },
            { label: "New Jobs", value: stats.newJobs, urlIcon: icon4 },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-md shadow-md p-4 flex items-center gap-5">
              <div>
                <img src={item.urlIcon} alt="Icon" />
              </div>
              <div>
                <div className="text-2xl text-gray-900">
                  <CountUp end={item.value} separator="," />
                </div>
                <div className="text-gray-500 text-sm mt-1">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;
