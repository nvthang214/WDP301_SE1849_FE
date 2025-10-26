import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CompanyService } from "../../../../services/CompanyService";
import {
  Calendar,
  Users,
  Building2,
  Briefcase,
  Globe,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

export default function CompanyInformation() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);

  useEffect(() => {
    async function fetchCompany() {
      try {
        const res = await CompanyService.getCompanyDetails(id);
        setCompany(res.data);
      } catch {
        setCompany(null);
      }
    }
    fetchCompany();
  }, [id]);

  if (!company) {
    return <div className="py-10 text-center text-gray-400">Loading...</div>;
  }

  // Lấy dữ liệu từ model mới, có kiểm tra null/undefined
  const logo =
    company.logo ||
    "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png";
  const banner =
    company.banner ||
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80";
  const name = company.name || "Company Name";
  const industry = company.industry || "Information Technology (IT)";
  const description = company.description || "No description provided.";
  const benefits = company.benefits ? (
    <ul className="list-inside list-disc">
      {company.benefits.split("\n").map((b, idx) => (
        <li key={idx}>{b}</li>
      ))}
    </ul>
  ) : (
    "No benefits listed."
  );
  const vision = company.vision || "No vision provided.";
  const founded = company.foundedDate ? new Date(company.foundedDate).toLocaleDateString() : "--";
  const teamSize = company.teamSize ? company.teamSize : "N/A";
  const address = company.address || "--";

  // Contact & Social
  const contact = company.contact || {};
  const website = contact.website || "--";
  const phone = contact.phone || "--";
  const email = contact.email || "--";

  const social = company.social || {};
  const facebook = social.facebook || "#";
  const twitter = social.twitter || "#";
  const linkedin = social.linkedin || "#";
  const youtube = social.youtube || "#";
  const instagram = social.instagram || "#";

  return (
    <div className="min-h-screen bg-gray-50 px-0 py-8 md:px-8">
      {/* Banner */}
      <div className="relative mb-[-64px] h-48 w-full overflow-hidden rounded-xl bg-gray-200 md:h-64">
        <img src={banner} alt="banner" className="h-full w-full object-cover" />
      </div>
      {/* Card */}
      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="-mt-16 mb-8 flex flex-col items-center gap-6 rounded-xl bg-white px-8 py-6 shadow-lg md:flex-row md:items-end">
          <img
            src={logo}
            alt="logo"
            className="h-24 w-24 rounded-xl border-4 border-white object-cover shadow"
          />
          <div className="flex-1">
            <div className="text-2xl font-bold">{name}</div>
            <div className="mt-1 text-gray-500">{industry}</div>
          </div>
          <button
            type="button"
            aria-label="View open positions"
            onClick={() => (window.location.href = `/company/${id}/jobs`)}
            className="inline-flex transform items-center gap-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-400 px-5 py-2.5 text-sm font-semibold !text-white shadow-md transition duration-150 ease-in-out hover:-translate-y-0.5 hover:from-blue-600 hover:to-blue-500 hover:shadow-lg focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:outline-none"
          >
            <span>View Open Positions</span>
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-10">
        {/* Left: Description & Benefits */}
        <div className="col-span-1 md:col-span-6">
          <div className="mb-6 rounded-xl bg-white p-8 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Description</h2>
            <div className="whitespace-pre-line text-gray-700">{description}</div>
          </div>
          <div className="mb-6 rounded-xl bg-white p-8 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Company Benefits</h2>
            <div className="whitespace-pre-line text-gray-700">{benefits}</div>
          </div>
          <div className="mb-6 rounded-xl bg-white p-8 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Company Vision</h2>
            <div className="whitespace-pre-line text-gray-700">{vision}</div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="font-medium text-gray-600">Share profile:</span>
            <button className="flex items-center gap-1 rounded bg-blue-50 px-3 py-1 text-blue-600 hover:bg-blue-100">
              <Facebook size={16} /> Facebook
            </button>
            <button className="flex items-center gap-1 rounded bg-blue-50 px-3 py-1 text-blue-600 hover:bg-blue-100">
              <Twitter size={16} /> Twitter
            </button>
            <button className="flex items-center gap-1 rounded bg-pink-50 px-3 py-1 text-pink-600 hover:bg-pink-100">
              <Instagram size={16} /> Pinterest
            </button>
          </div>
        </div>
        {/* Right: Sidebar */}
        <div className="col-span-1 flex flex-col gap-6 md:col-span-4">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 font-medium text-gray-400">
                  <Calendar size={16} /> FOUNDED IN:
                </span>
                <div>{founded}</div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 font-medium text-gray-400">
                  <Building2 size={16} /> ORGANIZATION TYPE:
                </span>
                <div>Private Company</div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 font-medium text-gray-400">
                  <Users size={16} /> TEAM SIZE:
                </span>
                <div>{teamSize}</div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 font-medium text-gray-400">
                  <Briefcase size={16} /> INDUSTRY TYPES:
                </span>
                <div>{industry}</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-2 font-semibold">Contact Information</div>
            <div className="flex flex-col gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-blue-600" />
                <div>
                  <span className="block text-xs text-gray-400">WEBSITE</span>
                  {website !== "--" ? (
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {website}
                    </a>
                  ) : (
                    "--"
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-blue-600" />
                <div>
                  <span className="block text-xs text-gray-400">PHONE</span>
                  {phone}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-blue-600" />
                <div>
                  <span className="block text-xs text-gray-400">EMAIL ADDRESS</span>
                  {email}
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-2 font-semibold">Follow us on:</div>
            <div className="flex gap-3">
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded p-2 text-blue-600 hover:bg-blue-50"
              >
                <Facebook size={20} />
              </a>
              <a
                href={twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded p-2 text-blue-400 hover:bg-blue-50"
              >
                <Twitter size={20} />
              </a>
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded p-2 text-pink-500 hover:bg-pink-50"
              >
                <Instagram size={20} />
              </a>
              <a
                href={youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded p-2 text-red-600 hover:bg-red-50"
              >
                <Youtube size={20} />
              </a>
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded p-2 text-blue-700 hover:bg-blue-50"
              >
                <Briefcase size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
