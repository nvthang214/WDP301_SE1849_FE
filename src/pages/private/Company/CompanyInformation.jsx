import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CompanyService } from "../../../services/CompanyService";
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
        const res = await CompanyService.getCompanyById(id);
        setCompany(res.data);
      } catch {
        setCompany(null);
      }
    }
    fetchCompany();
  }, [id]);

  if (!company) {
    return <div className="text-center py-10 text-gray-400">Loading...</div>;
  }

  // Lấy dữ liệu từ model mới, có kiểm tra null/undefined
  const logo = company.logo || "https://www.google.com/images/branding/googlelogo/2x/googlelogo_light_color_92x30dp.png";
  const banner = company.banner || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80";
  const name = company.name || "Company Name";
  const industry = company.industry || "Information Technology (IT)";
  const description = company.description || "No description provided.";
  const benefits = company.benefits
    ? (
      <ul className="list-disc list-inside">
        {company.benefits.split("\n").map((b, idx) => (
          <li key={idx}>{b}</li>
        ))}
      </ul>
    )
    : "No benefits listed.";
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
    <div className="bg-gray-50 min-h-screen px-0 md:px-8 py-8">
      {/* Banner */}
      <div className="relative w-full h-48 md:h-64 bg-gray-200 rounded-xl overflow-hidden mb-[-64px]">
        <img
          src={banner}
          alt="banner"
          className="w-full h-full object-cover"
        />
      </div>
      {/* Card */}
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row items-center md:items-end gap-6 px-8 py-6 -mt-16 mb-8">
          <img
            src={logo}
            alt="logo"
            className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow"
          />
          <div className="flex-1">
            <div className="text-2xl font-bold">{name}</div>
            <div className="text-gray-500 mt-1">{industry}</div>
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2">
            View Open Position <span>→</span>
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-10 gap-8">
        {/* Left: Description & Benefits */}
        <div className="col-span-1 md:col-span-6">
          <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
            <h2 className="font-semibold text-lg mb-2">Description</h2>
            <div className="text-gray-700 whitespace-pre-line">{description}</div>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
            <h2 className="font-semibold text-lg mb-2">Company Benefits</h2>
            <div className="text-gray-700 whitespace-pre-line">{benefits}</div>
          </div>
          <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
            <h2 className="font-semibold text-lg mb-2">Company Vision</h2>
            <div className="text-gray-700 whitespace-pre-line">{vision}</div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <span className="font-medium text-gray-600">Share profile:</span>
            <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 flex items-center gap-1">
              <Facebook size={16} /> Facebook
            </button>
            <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 flex items-center gap-1">
              <Twitter size={16} /> Twitter
            </button>
            <button className="bg-pink-50 text-pink-600 px-3 py-1 rounded hover:bg-pink-100 flex items-center gap-1">
              <Instagram size={16} /> Pinterest
            </button>
          </div>
        </div>
        {/* Right: Sidebar */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-gray-400 font-medium">
                  <Calendar size={16} /> FOUNDED IN:
                </span>
                <div>{founded}</div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-gray-400 font-medium">
                  <Building2 size={16} /> ORGANIZATION TYPE:
                </span>
                <div>Private Company</div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-gray-400 font-medium">
                  <Users size={16} /> TEAM SIZE:
                </span>
                <div>{teamSize}</div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1 text-gray-400 font-medium">
                  <Briefcase size={16} /> INDUSTRY TYPES:
                </span>
                <div>{industry}</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="font-semibold mb-2">Contact Information</div>
            <div className="flex flex-col gap-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-blue-600" />
                <div>
                  <span className="text-gray-400 block text-xs">WEBSITE</span>
                  {website !== "--" ? (
                    <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {website}
                    </a>
                  ) : "--"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={18} className="text-blue-600" />
                <div>
                  <span className="text-gray-400 block text-xs">PHONE</span>
                  {phone}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-blue-600" />
                <div>
                  <span className="text-gray-400 block text-xs">EMAIL ADDRESS</span>
                  {email}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="font-semibold mb-2">Follow us on:</div>
            <div className="flex gap-3">
              <a href={facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:bg-blue-50 rounded p-2">
                <Facebook size={20} />
              </a>
              <a href={twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:bg-blue-50 rounded p-2">
                <Twitter size={20} />
              </a>
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:bg-pink-50 rounded p-2">
                <Instagram size={20} />
              </a>
              <a href={youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:bg-red-50 rounded p-2">
                <Youtube size={20} />
              </a>
              <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:bg-blue-50 rounded p-2">
                <Briefcase size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}