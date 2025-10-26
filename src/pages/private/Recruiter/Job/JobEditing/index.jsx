import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { JobService } from "../../../../../services/JobService";
import { UserService } from "../../../../../services/UserService";
import { TagService } from "../../../../../services/TagService";
import { CategoryService } from "../../../../../services/CategoryService";
import { Select } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { notifyError, notifySuccess } from "../../../../../components/Notification";

const jobTypes = ["FULL-TIME", "PART-TIME", "INTERNSHIP", "TEMPORARY", "CONTRACT BASE"];
const jobLevels = ["Intern", "Fresher", "Junior", "Middle", "Senior", "Lead"];

export default function JobEditing() {
  const { id } = useParams();
  const [form, setForm] = useState({
    company: "",
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
    benefits: "",
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
        const res = await JobService.getCompanyOfRecruiter();
        setForm((prev) => ({ ...prev, company: res.data._id }));
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
        const res = await JobService.getJobById("", id);
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
          benefits: res.data.benefits || "",
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

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link", "blockquote", "code-block"],
      ["clean"],
    ],
  };

  const handleRichTextChange = (field) => (value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    try {
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
      notifySuccess("Job updated successfully!");
      setTimeout(() => {
        window.location.href = "/recruiter/jobs/my-jobs";
      }, 500);
    } catch (error) {
      console.error("Failed to update job:", error);
      notifyError("Failed to update job. Please try again.");
    }
  };

  if (loading) return <div className="py-10 text-center text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)]">
      <form className="mx-auto max-w-5xl" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold tracking-wide text-[var(--color-primary-400)] uppercase">
              Recruiter Dashboard
            </p>
            <h1 className="text-xl font-semibold text-[var(--color-primary-700)]">Post a Job</h1>
          </div>
        </div>

        <div className="space-y-4">
          <section>
            <div className="space-y-6">
              {/* Tags & Role */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-neutral-900)]">
                    Job Title
                  </label>
                  <input
                    className="w-full rounded-xl border border-[var(--color-neutral-200)] p-2 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] focus:outline-none"
                    name="title"
                    placeholder="Add job title, role, vacancies etc"
                    value={form.title}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-neutral-900)]">
                    Tags
                  </label>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    className="w-full rounded-xl"
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
              </div>
            </div>
          </section>

          <section>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
              {/* Min Salary */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-neutral-900)]">
                  Min Salary
                </label>
                <div className="flex overflow-hidden rounded-xl border border-[var(--color-neutral-200)]">
                  <input
                    className="w-full p-2 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none"
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
                <label className="block text-sm font-medium text-[var(--color-neutral-900)]">
                  Max Salary
                </label>
                <div className="flex overflow-hidden rounded-xl border border-[var(--color-neutral-200)]">
                  <input
                    className="w-full p-2 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:outline-none"
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
                <label className="block text-sm font-medium text-[var(--color-neutral-900)]">
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
                <label className="block text-sm font-medium text-[var(--color-neutral-900)]">
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

          <section>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {/* Education */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-[var(--color-neutral-900)]">
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
                <label className="block text-sm font-medium text-[var(--color-neutral-900)]">
                  Experience
                </label>
                <input
                  className="w-full rounded-xl border border-[var(--color-neutral-200)] p-2 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] focus:outline-none"
                  name="experience"
                  placeholder="Experience"
                  value={form.experience}
                  onChange={handleChange}
                />
              </div>
              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-neutral-900)]">
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
                <label className="block text-sm font-medium text-[var(--color-neutral-900)]">
                  Vacancies
                </label>
                <input
                  className="w-full rounded-xl border border-[var(--color-neutral-200)] p-2 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] focus:outline-none"
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
                <label className="block text-sm font-medium text-[var(--color-neutral-900)]">
                  Expiration Date
                </label>
                <input
                  className="w-full rounded-xl border border-[var(--color-neutral-200)] p-2 text-[var(--color-neutral-900)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] focus:outline-none"
                  name="expiration"
                  type="date"
                  value={form.expiration}
                  onChange={handleChange}
                />
              </div>
              {/* Job Level */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-neutral-900)]">
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
              <div>
                <label className="block text-sm font-medium text-[var(--color-neutral-900)]">
                  Remote
                </label>
                <input
                  type="checkbox"
                  name="remote"
                  checked={form.remote}
                  onChange={handleChange}
                />
                <span className="text-sm text-[var(--color-neutral-700)]">
                  Fully Remote Position – <span className="font-semibold">Worldwide</span>
                </span>
              </div>
            </div>
          </section>

          <section>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-neutral-900)]">
                    Country
                  </label>
                  <input
                    className="w-full rounded-xl border border-[var(--color-neutral-200)] p-2 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] focus:outline-none"
                    name="country"
                    placeholder="Country"
                    value={form.country}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-neutral-900)]">
                    City
                  </label>
                  <input
                    className="w-full rounded-xl border border-[var(--color-neutral-200)] p-2 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] focus:outline-none"
                    name="city"
                    placeholder="City"
                    value={form.city}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </section>
          <section>
            <label className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]">
              Apply Job On
            </label>
            <div className="flex flex-col gap-4 md:flex-row">
              {["Jobpilot", "external", "email"].map((type) => {
                const active = form.applyType === type;
                return (
                  <label
                    key={type}
                    className={`flex flex-1 items-start gap-3 rounded-xl border p-2 transition ${
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
          {/* Job Description */}
          <section>
            <label className="block text-sm font-medium text-[var(--color-neutral-900)]">
              Job Description
            </label>
            <ReactQuill
              theme="snow"
              modules={quillModules}
              value={form.description}
              onChange={handleRichTextChange("description")}
              placeholder="Share job responsibilities, requirements..."
              className="rounded-xl"
            />
          </section>
          {/* Job Requirements */}
          <section>
            <label className="block text-sm font-medium text-[var(--color-neutral-900)]">
              Job Requirements
            </label>
            <ReactQuill
              theme="snow"
              modules={quillModules}
              value={form.requirements}
              onChange={handleRichTextChange("requirements")}
              placeholder="Share must-have skills, qualifications..."
              className="rounded-xl"
            />
          </section>
          {/* Job Desirable */}
          <section>
            <label className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]">
              Job Desirable
            </label>
            <ReactQuill
              theme="snow"
              modules={quillModules}
              value={form.desirable}
              onChange={handleRichTextChange("desirable")}
              placeholder="Share bonus points, nice-to-have experience..."
              className="rounded-xl"
            />
          </section>
          {/* Job Benefits */}
          <section>
            <label className="mb-2 block text-sm font-medium text-[var(--color-neutral-900)]">
              Job Benefits
            </label>
            <ReactQuill
              theme="snow"
              modules={quillModules}
              value={form.benefits}
              onChange={handleRichTextChange("benefits")}
              placeholder="Share benefits, perks, and incentives..."
              className="rounded-xl"
            />
          </section>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary-500)] px-6 py-3 text-sm font-semibold !text-white shadow-[var(--shadow-md)] transition hover:bg-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-300)] focus:outline-none"
          >
            Save Job
          </button>
        </div>
      </form>
    </div>
  );
}
