import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

export default function JobEditing() {
  const { id } = useParams();
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
  const [loading, setLoading] = useState(true);

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

  // Fetch categories
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

  // Fetch job details to edit
  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await JobService.getJobById(id);
        let tagIds = [];
        if (Array.isArray(res.data.tags) && res.data.tags.length > 0) {
          tagIds = res.data.tags.map((tagObj) => tagObj._id || tagObj);
        }
        setForm({
          category: res.data.category?._id || res.data.category || "",
          title: res.data.title || "",
          tags: tagIds,
          role: res.data.role || "",
          minSalary: res.data.minSalary || "",
          maxSalary: res.data.maxSalary || "",
          salaryType: res.data.salaryType || "",
          education: res.data.education || "",
          experience: res.data.experience || "",
          jobType: res.data.jobType || "",
          vacancies: res.data.vacancies ? String(res.data.vacancies) : "",
          expiration: res.data.expiration ? res.data.expiration.slice(0, 10) : "",
          jobLevel: res.data.jobLevel || "",
          country: res.data.country || "",
          city: res.data.city || "",
          remote: !!res.data.remote,
          benefits: Array.isArray(res.data.benefits) ? res.data.benefits : [],
          description: res.data.description || "",
          requirements: res.data.requirements || "",
          desirable: res.data.desirable || "",
          applyType: res.data.applyType || "Jobpilot",
          location: res.data.location || res.data.city || "",
          isActive: typeof res.data.isActive === "boolean" ? res.data.isActive : true,
        });
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

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
      company: form.company,
      recruiter: form.recruiter,
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
    await JobService.updateJob(id, submitData);
    alert("Job updated!");
  };

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)]">
      <form
        className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-[var(--shadow-lg)]"
        onSubmit={handleSubmit}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-primary-400)]">
              Recruiter Dashboard
            </p>
            <h2 className="text-3xl font-semibold text-[var(--color-primary-700)]">Edit Job</h2>
          </div>
        </div>

        {/* giữ nguyên cấu trúc, áp dụng lại style giống JobPosting */}
        <div className="space-y-8">
          {/* Job Basics */}
          <section className="rounded-2xl border border-[var(--color-neutral-200)] bg-[var(--color-neutral-100)]/40 p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-primary-100)] text-[var(--color-primary-500)]">
                1
              </span>
              <h3 className="text-lg font-semibold text-[var(--color-neutral-900)]">Job Basics</h3>
            </div>
            <div className="space-y-6">
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

          {/* Salary & Category */}
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

          {/* Advanced Information */}
          <section className="rounded-2xl border border-[var(--color-neutral-200)] bg-white p-6 descoberta shadow-[var(--shadow-sm)]">
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
              <div>
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

          {/* Location, Benefits, Rich fields duplicated from JobPosting (ensure same styling) */}
          {/* Copy identical sections for Location, Benefits, textareas, Apply, and Submit */}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary-500)] px-6 py-3 text-sm font-semibold text-white shadow-[var(--shadow-md)] transition hover:bg-[var(--color-primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-300)]"
          >
            Update Job
            <span className="text-lg">→</span>
          </button>
        </div>
      </form>
    </div>
  );
  // ...existing code...
}
