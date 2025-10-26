import { createElement } from "react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../../assets/images/Logo/logosvg.svg";
import ROUTER from "../../../router/ROUTER";

const productLinks = [
  { label: "About", path: "#" },
  { label: "Contact", path: "#" },
  { label: "Pricing", path: "#" },
  { label: "Blog", path: "#" },
];

const candidateLinks = [
  { label: "Browse Jobs", path: ROUTER.JOB_LIST },
  { label: "Browse Employers", path: ROUTER.COMPANY_LIST },
  { label: "Candidate Dashboard", path: "#" },
  { label: "Saved Jobs", path: "#" },
];

const employerLinks = [
  { label: "Post A Job", path: ROUTER.JOB_POST },
  { label: "Browse Candidates", path: "#" },
  { label: "Employer Dashboard", path: "#" },
  { label: "Applications", path: "#" },
];

const supportLinks = [
  { label: "FAQs", path: "#" },
  { label: "Privacy Policy", path: "#" },
  { label: "Terms & Conditions", path: "#" },
  { label: "Help Center", path: "#" },
];

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
];

const FooterCommon = () => {
  return (
    <footer className="bg-[#0A1423] text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_repeat(4,1fr)]">
          <div className="space-y-6">
            <Link to={ROUTER.HOME} className="flex items-center gap-3">
              <img src={logo} alt="Jobpilot" className="h-10 w-auto" />
              <span className="text-2xl font-semibold text-white">Jobpilot</span>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400">
              Call now: <span className="font-semibold text-white">(319) 555-0115</span>
              <br />
              6391 Elgin St. Celina, Delaware 10299, New York, United States of America
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-neutral-200 transition hover:border-primary-400 hover:text-primary-300"
                >
                  {createElement(icon, { className: "h-4 w-4" })}
                </a>
              ))}
            </div>
          </div>

          <FooterSection title="Quick Links" links={productLinks} />
          <FooterSection title="Candidate" links={candidateLinks} />
          <FooterSection title="Employers" links={employerLinks} />
          <FooterSection title="Support" links={supportLinks} />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-8 text-sm text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Jobpilot · Job Portal. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {supportLinks.map(({ label, path }) => (
              <Link key={label} to={path} className="transition hover:text-primary-300">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterSection = ({ title, links }) => (
  <div className="space-y-4">
    <h3 className="text-sm font-semibold uppercase tracking-wide text-white/80">{title}</h3>
    <ul className="space-y-3 text-sm text-neutral-400">
      {links.map(({ label, path }) => (
        <li key={label}>
          <Link to={path} className="transition hover:text-primary-300">
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);
export default FooterCommon;
