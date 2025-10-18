import React, { useEffect, useState } from "react";
import { JobService } from "../../../services/JobService";
import { TagService } from "../../../services/TagService";
import { CategoryService } from "../../../services/CategoryService";
import { Select } from "antd";

const jobTypes = ["FULL-TIME", "PART-TIME", "INTERNSHIP", "TEMPORARY", "CONTRACT BASE"];
const jobLevels = ["Intern", "Fresher", "Junior", "Middle", "Senior", "Lead"];
const benefitsList = [
  "401k Salary",
  "Distributed Team",
  "Async",
  "Vision Insurance",
  "Dental Insurance",
  "Medical Insurance",
  "Unlimited vacation",
  "4 day workweek",
  "401k matching",
  "company retreats",
  "Learning budget",
  "Free gym membership",
  "Pay in crypto",
  "Profit Sharing",
  "Equity Compensation",
  "No whiteboard interview",
  "No politics at work",
  "We hire old (and young)",
];

export default function JobPosting() {
  const [form, setForm] = useState({
    company: "",
    recruiter: "",
    category: "",
    title: "",
    tags: [],
    role: "",
    minSalary: "",
    maxSalary: "",
    salaryType: "",
    education: "",
    experience: "",
    jobType: "",
    vacancies: "",
    expiration: "",
    jobLevel: "",
    country: "",
    city: "",
    remote: false,
    benefits: [],
    description: "",
    requirements: "",
    desirable: "",
    applyType: "Jobpilot",
    location: "",
    isActive: true,
  });

  // Fetch all tags for selection
  const [allTags, setAllTags] = useState([]);
  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await TagService.getAllTags();
        setAllTags(res.data);
      } catch {
        setAllTags([]);
      }
    }
    fetchTags();
  }, []);

  // Fetch categories (not used in form but could be useful)
  const [allCategories, setAllCategories] = useState([]);
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await CategoryService.getAllCategories();
        setAllCategories(res.data);
      } catch {
        setAllCategories([]);
      }
    }
    fetchCategories();
  }, []);

  // Fetch company by recruiter ID (hardcoded for now)
  useEffect(() => {
    async function fetchCompany() {
      try {
        const recruiterId = "68ebccd50612c5184b23abbe"; // Replace with actual recruiter ID
        const res = await JobService.getCompanyByRecruiterId(recruiterId);
        setForm((prev) => ({ ...prev, company: res.data._id, recruiter: recruiterId }));
      } catch (error) {
        console.error("Failed to fetch company:", error);
      }
    }
    fetchCompany();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTagsChange = (values) => {
    setForm((prev) => ({
      ...prev,
      tags: values,
    }));
  };

  const handleBenefitToggle = (benefit) => {
    setForm((prev) => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter((b) => b !== benefit)
        : [...prev.benefits, benefit],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      recruiter: form.recruiter,
      company: form.company,
      category: form.category,
      title: form.title,
      description: form.description,
      tags: form.tags,
      role: form.role,
      minSalary: Number(form.minSalary),
      maxSalary: Number(form.maxSalary),
      salaryType: form.salaryType,
      education: form.education,
      experience: form.experience,
      jobType: form.jobType,
      vacancies: Number(form.vacancies),
      expiration: form.expiration ? new Date(form.expiration).toISOString() : "",
      jobLevel: form.jobLevel,
      country: form.country,
      city: form.city,
      remote: !!form.remote,
      benefits: form.benefits,
      applyType: form.applyType,
      requirements: form.requirements,
      desirable: form.desirable,
      location: form.location || form.city,
      isActive: typeof form.isActive === "boolean" ? form.isActive : true,
    };
    await JobService.postJob(submitData);
    alert("Job posted!");
  };

  // ...existing code...
  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)]">
      <form
        className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-[var(--shadow-lg)]"
        onSubmit={handleSubmit}
      >
        <div className=" flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-primary-400)]">
              Recruiter Dashboard
            </p>
            <h2 className="text-3xl font-semibold text-[var(--color-primary-700)]">Post a Job</h2>
          </div>
        </div>

        <div className="space-y-8">
          <section className="rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)]/40 p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-500)]">
                1
              </span>
              <h3 className="text-lg font-semibold text-[var(--color-neutral-900)]">Job Basics</h3>
            </div>
            <div className="space-y-6">
              {/* Job Title */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]">
                  Job Title
                </label>
                <input
                  className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                  name="title"
                  placeholder="Add job title, role, vacancies etc"
                  value={form.title}
                  onChange={handleChange}
                />
              </div>

              {/* Tags & Role */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]">
                    Tags
                  </label>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    className="rounded-xl"
                    placeholder="Select tags"
                    value={form.tags}
                    onChange={handleTagsChange}
                    options={allTags.map((tag) => ({
                      label: tag.name,
                      value: tag._id,
                    }))}
                    optionFilterProp="label"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]">
                    Job Role
                  </label>
                  <input
                    className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="Job role"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-neutral-200)] bg-white p-6 shadow-[var(--shadow-sm)]">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-500)]">
                2
              </span>
              <h3 className="text-lg font-semibold text-[var(--color-neutral-900)]">
                Salary & Category
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {/* Min Salary */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]">
                  Min Salary
                </label>
                <div className="flex overflow-hidden rounded-xl border border-[var(--color-neutral-200)]">
                  <input
                    className="w-full px-4 py-3 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none"
                    name="minSalary"
                    placeholder="Minimum salary..."
                    value={form.minSalary}
                    onChange={handleChange}
                    type="number"
                  />
                  <span className="grid place-items-center bg-[var(--color-neutral-100)] px-3 text-sm font-semibold text-[var(--color-neutral-500)]">
                    USD
                  </span>
                </div>
              </div>
              {/* Max Salary */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]">
                  Max Salary
                </label>
                <div className="flex overflow-hidden rounded-xl border border-[var(--color-neutral-200)]">
                  <input
                    className="w-full px-4 py-3 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none"
                    name="maxSalary"
                    placeholder="Maximum salary..."
                    value={form.maxSalary}
                    onChange={handleChange}
                    type="number"
                  />
                  <span className="grid place-items-center bg-[var(--color-neutral-100)] px-3 text-sm font-semibold text-[var(--color-neutral-500)]">
                    USD
                  </span>
                </div>
              </div>
              {/* Salary Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]">
                  Salary Type
                </label>
                <Select
                  style={{ width: "100%" }}
                  className="rounded-xl"
                  value={form.salaryType || undefined}
                  onChange={(val) => setForm((prev) => ({ ...prev, salaryType: val }))}
                  options={[
                    { label: "Monthly", value: "Monthly" },
                    { label: "Yearly", value: "Yearly" },
                    { label: "USD", value: "USD" },
                  ]}
                  placeholder="Select salary type"
                  allowClear
                  showSearch
                />
              </div>
              {/* Category */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]">
                  Category
                </label>
                <Select
                  style={{ width: "100%" }}
                  className="rounded-xl"
                  value={form.category || undefined}
                  onChange={(val) => setForm((prev) => ({ ...prev, category: val }))}
                  options={allCategories.map((cat) => ({
                    label: cat.name,
                    value: cat._id,
                  }))}
                  placeholder="Select category"
                  allowClear
                  showSearch
                  optionFilterProp="label"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-neutral-200)] bg-white p-6 shadow-[var(--shadow-sm)]">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-500)]">
                3
              </span>
              <h3 className="text-lg font-semibold text-[var(--color-neutral-900)]">
                Advanced Information
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {/* Education */}
              <div className="md:col-span-1">
                <label className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]">
                  Education
                </label>
                <Select
                  style={{ width: "100%" }}
                  className="rounded-xl"
                  value={form.education || undefined}
                  onChange={(val) => setForm((prev) => ({ ...prev, education: val }))}
                  options={[
                    { label: "Graduated", value: "Graduated" },
                    { label: "Bachelor", value: "Bachelor" },
                    { label: "Master", value: "Master" },
                    { label: "Ph.D", value: "Ph.D" },
                  ]}
                  placeholder="Select education"
                  allowClear
                  showSearch
                />
              </div>
              {/* Experience */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]">
                  Experience
                </label>
                <input
                  className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                  name="experience"
                  placeholder="Experience"
                  value={form.experience}
                  onChange={handleChange}
                />
              </div>
              {/* Job Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]">
                  Job Type
                </label>
                <Select
                  style={{ width: "100%" }}
                  className="rounded-xl"
                  value={form.jobType || undefined}
                  onChange={(val) => setForm((prev) => ({ ...prev, jobType: val }))}
                  options={jobTypes.map((type) => ({ label: type, value: type }))}
                  placeholder="Select job type"
                  allowClear
                  showSearch
                />
              </div>
              {/* Vacancies */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]">
                  Vacancies
                </label>
                <input
                  className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                  name="vacancies"
                  type="number"
                  placeholder="Vacancies"
                  value={form.vacancies}
                  onChange={handleChange}
                  min={1}
                />
              </div>
              {/* Expiration */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]">
                  Expiration Date
                </label>
                <input
                  className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                  name="expiration"
                  type="date"
                  value={form.expiration}
                  onChange={handleChange}
                />
              </div>
              {/* Job Level */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]">
                  Job Level
                </label>
                <Select
                  style={{ width: "100%" }}
                  className="rounded-xl"
                  value={form.jobLevel || undefined}
                  onChange={(val) => setForm((prev) => ({ ...prev, jobLevel: val }))}
                  options={jobLevels.map((level) => ({ label: level, value: level }))}
                  placeholder="Select job level"
                  allowClear
                  showSearch
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-neutral-200)] bg-white p-6 shadow-[var(--shadow-sm)]">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-500)]">
                4
              </span>
              <h3 className="text-lg font-semibold text-[var(--color-neutral-900)]">Location</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]">
                    Country
                  </label>
                  <input
                    className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                    name="country"
                    placeholder="Country"
                    value={form.country}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]">
                    City
                  </label>
                  <input
                    className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <label className="flex items-center gap-3 rounded-xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)] px-4 py-3">
                <input
                  type="checkbox"
                  name="remote"
                  checked={form.remote}
                  onChange={handleChange}
                />
                <span className="text-sm text-[var(--color-neutral-700)]">
                  Fully Remote Position – <span className="font-semibold">Worldwide</span>
                </span>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-neutral-200)] bg-white p-6 shadow-[var(--shadow-sm)]">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-500)]">
                5
              </span>
              <h3 className="text-lg font-semibold text-[var(--color-neutral-900)]">Benefits</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {benefitsList.map((benefit) => {
                const active = form.benefits.includes(benefit);
                return (
                  <button
                    type="button"
                    key={benefit}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "border-[var(--color-primary-400)] bg-[var(--color-primary-100)] text-[var(--color-primary-600)] shadow-[var(--shadow-sm)]"
                        : "border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)] hover:border-[var(--color-primary-200)] hover:bg-[var(--color-primary-50)]"
                    }`}
                    onClick={() => handleBenefitToggle(benefit)}
                  >
                    {benefit}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-neutral-200)] bg-white p-6 shadow-[var(--shadow-sm)]">
            <div className="mb-6 grid gap-6 md:grid-cols-2">
              {[
                {
                  label: "Job Description",
                  name: "description",
                  placeholder: "Describe responsibilities, tasks, tools...",
                },
                {
                  label: "Job Requirements",
                  name: "requirements",
                  placeholder: "List required skills, experience, qualifications...",
                },
              ].map(({ label, name, placeholder }) => (
                <div key={name}>
                  <label className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]">
                    {label}
                  </label>
                  <textarea
                    className="min-h-[160px] w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                    name={name}
                    placeholder={placeholder}
                    value={form[name]}
                    onChange={handleChange}
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]">
                Job Desirable
              </label>
              <textarea
                className="min-h-[160px] w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:border-[var(--color-primary-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                name="desirable"
                placeholder="Share bonus points, nice-to-have experience..."
                value={form.desirable}
                onChange={handleChange}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)] p-6 shadow-[var(--shadow-sm)]">
            <h3 className="mb-4 text-lg font-semibold text-[var(--color-neutral-900)]">
              Apply Job on:
            </h3>
            <div className="flex flex-col gap-4 md:flex-row">
              {["Jobpilot", "external", "email"].map((type) => {
                const active = form.applyType === type;
                return (
                  <label
                    key={type}
                    className={`flex flex-1 items-start gap-3 rounded-xl border bg-white p-4 transition ${
                      active
                        ? "border-[var(--color-primary-400)] shadow-[var(--shadow-md)]"
                        : "border-transparent hover:border-[var(--color-primary-200)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="applyType"
                      value={type}
                      checked={active}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-sm font-semibold text-[var(--color-neutral-900)]">
                        {type === "Jobpilot"
                          ? "On Jobpilot"
                          : type === "external"
                            ? "External Platform"
                            : "On Your Email"}
                      </div>
                      <p className="mt-1 text-xs text-[var(--color-neutral-500)]">
                        {type === "Jobpilot"
                          ? "Candidates apply via Jobpilot and appear in your dashboard."
                          : type === "external"
                            ? "Redirect candidates to your site and manage applications yourself."
                            : "Receive applications directly in your inbox."}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary-500)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-md)] transition hover:bg-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
          >
            Post Job
            <span className="text-lg">→</span>
          </button>
        </div>
      </form>
    </div>
  );
}
