import React, { useEffect, useState } from "react";
import { JobService } from "../../../../../services/JobService";
import { TagService } from "../../../../../services/TagService";
import { CategoryService } from "../../../../../services/CategoryService";
import { Select, Spin } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { notifyError, notifySuccess } from "../../../../../components/Notification";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../../../store/useAuthStore";

const jobTypes = ["FULL-TIME", "PART-TIME", "INTERNSHIP", "TEMPORARY", "CONTRACT BASE"];
const jobLevels = ["Intern", "Fresher", "Junior", "Middle", "Senior", "Lead"];

export default function JobPosting() {
  const nav = useNavigate();
  const { loading, setLoading } = useAuthStore();
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
  const [loading, setLoading] = useState(false);

  // Fetch all tags with pagination and search
  const [allTags, setAllTags] = useState([]);
  const [tagSearch, setTagSearch] = useState("");
  const [tagPage, setTagPage] = useState(1);
  const [tagLimit] = useState(50);
  const [tagPagination, setTagPagination] = useState({
    total: 0,
    totalPages: 1,
  });
  const [loadingTags, setLoadingTags] = useState(false);

  useEffect(() => {
    async function fetchTags() {
      try {
        setLoadingTags(true);
        const res = await TagService.getAllTags({
          page: tagPage,
          limit: tagLimit,
          search: tagSearch,
        });

        // Backend trả về: { success, message, data: [...tags], pagination: {...} }
        const tags = res.data?.data || res.data || [];
        const pagination = res.data?.pagination || { total: 0, totalPages: 1 };

        setAllTags(tags);
        setTagPagination(pagination);
      } catch (error) {
        console.error("Error fetching tags:", error);
        setAllTags([]);
      } finally {
        setLoadingTags(false);
      }
    }
    fetchTags();
  }, [tagPage, tagLimit, tagSearch]);

  // Fetch categories
  const [allCategories, setAllCategories] = useState([]);
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await CategoryService.getAllCategories();
        setAllCategories(res.data || []);
      } catch {
        setAllCategories([]);
      }
    }
    fetchCategories();
  }, []);

  // Fetch company by recruiter ID
  useEffect(() => {
    async function fetchCompany() {
      try {
        const res = await JobService.getCompanyOfRecruiter();
        if (res && res.data && res.data._id) {
          setForm((prev) => ({ ...prev, company: res.data._id }));
        }
      } catch (error) {
        console.error("Failed to fetch company:", error);
      }
    }
    fetchCompany();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle tags change
  const handleTagsChange = (values) => {
    setForm((prev) => ({
      ...prev,
      tags: values,
    }));
  };

  // Handle tag search
  const handleTagSearch = (value) => {
    setTagSearch(value);
    setTagPage(1); // Reset về trang 1 khi search
  };

  // Handle scroll to load more tags
  const handleTagPopupScroll = (e) => {
    const { target } = e;
    // Khi scroll gần đến cuối dropdown
    if (
      target.scrollTop + target.offsetHeight >= target.scrollHeight - 10 &&
      !loadingTags &&
      tagPage < tagPagination.totalPages
    ) {
      setTagPage((prev) => prev + 1);
    }
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

  // Handle form submission
  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();
      setLoading(true);
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
      setLoading(false);
      notifySuccess("Job posted successfully!");
      nav("/recruiter/jobs/my-jobs");
    } catch (error) {
      console.error("Failed to post job:", error);
      notifyError("Failed to post job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-neutral-50)]">
      <form className="mx-auto max-w-5xl" onSubmit={handleSubmit}>
        <Spin spinning={loading}>
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
                      {loadingTags && (
                        <span className="ml-2 text-xs text-[var(--color-primary-500)]">
                          Loading...
                        </span>
                      )}
                    </label>
                    <Select
                      mode="multiple"
                      allowClear
                      showSearch
                      style={{ width: "100%" }}
                      className="w-full rounded-xl"
                      placeholder="Search and select tags"
                      value={form.tags}
                      onChange={handleTagsChange}
                      onSearch={handleTagSearch}
                      onPopupScroll={handleTagPopupScroll}
                      options={allTags.map((tag) => ({
                        label: tag.name,
                        value: tag._id,
                      }))}
                      optionFilterProp="label"
                      filterOption={false} // Disable client-side filtering vì đã search từ server
                      loading={loadingTags}
                      dropdownRender={(menu) => (
                        <>
                          {menu}
                          {tagPage < tagPagination.totalPages && !loadingTags && (
                            <div className="px-4 py-2 text-center text-xs text-[var(--color-neutral-500)]">
                              Scroll down to load more...
                            </div>
                          )}
                        </>
                      )}
                    />
                    <p className="mt-1 text-xs text-[var(--color-neutral-500)]">
                      Showing {allTags.length} of {tagPagination.total} tags
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* ...existing code... */}
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

            {/* ...rest of the form sections remain the same... */}
            <section>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
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
                    Role
                  </label>
                  <input
                    className="w-full rounded-xl border border-[var(--color-neutral-200)] p-2 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] focus:outline-none"
                    name="role"
                    placeholder="Role"
                    value={form.role}
                    onChange={handleChange}
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
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-neutral-900)]">
                      Location (Not contain city and country name)
                    </label>
                    <input
                      className="w-full rounded-xl border border-[var(--color-neutral-200)] p-2 text-[var(--color-neutral-900)] placeholder:text-[var(--color-neutral-500)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-100)] focus:outline-none"
                      name="location"
                      placeholder="Location"
                      value={form.location}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </section>

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
              Post Job
            </button>
          </div>
        </Spin>
      </form>
    </div>
  );
}
