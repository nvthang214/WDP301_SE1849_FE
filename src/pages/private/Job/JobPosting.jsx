import React, { useEffect, useState } from "react";
import { JobService } from "../../../services/JobService";
import { TagService } from "../../../services/TagService";
import { CategoryService } from "../../../services/CategoryService";
import { Select } from "antd";

const jobTypes = [
  "FULL-TIME",
  "PART-TIME",
  "INTERNSHIP",
  "TEMPORARY",
  "CONTRACT BASE",
];
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
  "Bảo hiểm",
  "Du lịch",
  "Thưởng lễ tết",
  "Làm việc từ xa",
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

  const [allTags, setAllTags] = useState([]);
  const [allCategories, setAllCategories] = useState([]);

  // Fetch all tags for selection
  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await TagService.getAllTags();
        setAllTags(res.data || []);
      } catch {
        setAllTags([]);
      }
    }
    fetchTags();
  }, []);

  // Fetch all categories for selection
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
    // TODO: Lấy đúng company, recruiter, category id từ context hoặc props nếu có
    const submitData = {
      company: form.company || "68ebcd210612c5184b23abc5", // sửa lại id phù hợp với hệ thống của bạn
      recruiter: form.recruiter || "68ebccd50612c5184b23abbe", // sửa lại id phù hợp với hệ thống của bạn
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
    alert("Job posted successfully!");
  };

  return (
    <form className="max-w-5xl mx-auto py-8" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold mb-6">Post a job</h2>
      {/* Job Title */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Job Title</label>
        <input
          className="w-full border rounded px-3 py-2"
          name="title"
          placeholder="Add job title, role, vacancies etc"
          value={form.title}
          onChange={handleChange}
        />
      </div>
      {/* Tags & Role */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium mb-1">Tags</label>
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
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
          <label className="block font-medium mb-1">Job Role</label>
          <input
            className="w-full border rounded px-3 py-2"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Job role"
          />
        </div>
      </div>
      {/* Salary, Salary Type, Category */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Min Salary */}
        <div>
          <label className="block font-medium mb-1">Min Salary</label>
          <div className="flex">
            <input
              className="w-full border rounded-l px-3 py-2"
              name="minSalary"
              placeholder="Minimum salary..."
              value={form.minSalary}
              onChange={handleChange}
              type="number"
            />
            <span className="bg-gray-100 px-3 py-2 rounded-r border border-l-0">
              USD
            </span>
          </div>
        </div>
        {/* Max Salary */}
        <div>
          <label className="block font-medium mb-1">Max Salary</label>
          <div className="flex">
            <input
              className="w-full border rounded-l px-3 py-2"
              name="maxSalary"
              placeholder="Maximum salary..."
              value={form.maxSalary}
              onChange={handleChange}
              type="number"
            />
            <span className="bg-gray-100 px-3 py-2 rounded-r border border-l-0">
              USD
            </span>
          </div>
        </div>
        {/* Salary Type */}
        <div>
          <label className="block font-medium mb-1">Salary Type</label>
          <Select
            style={{ width: "100%" }}
            value={form.salaryType || undefined}
            onChange={(val) =>
              setForm((prev) => ({ ...prev, salaryType: val }))
            }
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
          <label className="block font-medium mb-1">Category</label>
          <Select
            style={{ width: "100%" }}
            value={form.category || undefined}
            onChange={(val) =>
              setForm((prev) => ({ ...prev, category: val }))
            }
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
      {/* Advance Information */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Education */}
        <div>
          <label className="block font-medium mb-1">Education</label>
          <Select
            style={{ width: "100%" }}
            value={form.education || undefined}
            onChange={(val) =>
              setForm((prev) => ({ ...prev, education: val }))
            }
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
          <label className="block font-medium mb-1">Experience</label>
          <input
            className="w-full border rounded px-3 py-2"
            name="experience"
            placeholder="Experience"
            value={form.experience}
            onChange={handleChange}
          />
        </div>
        {/* Job Type */}
        <div>
          <label className="block font-medium mb-1">Job Type</label>
          <Select
            style={{ width: "100%" }}
            value={form.jobType || undefined}
            onChange={(val) =>
              setForm((prev) => ({ ...prev, jobType: val }))
            }
            options={jobTypes.map((type) => ({ label: type, value: type }))}
            placeholder="Select job type"
            allowClear
            showSearch
          />
        </div>
        {/* Vacancies */}
        <div>
          <label className="block font-medium mb-1">Vacancies</label>
          <input
            className="w-full border rounded px-3 py-2"
            name="vacancies"
            type="number"
            placeholder="Vacancies"
            value={form.vacancies}
            onChange={handleChange}
            min={1}
          />
        </div>
        {/* Expiration Date */}
        <div>
          <label className="block font-medium mb-1">Expiration Date</label>
          <input
            className="w-full border rounded px-3 py-2"
            name="expiration"
            type="date"
            value={form.expiration}
            onChange={handleChange}
          />
        </div>
        {/* Job Level */}
        <div>
          <label className="block font-medium mb-1">Job Level</label>
          <Select
            style={{ width: "100%" }}
            value={form.jobLevel || undefined}
            onChange={(val) =>
              setForm((prev) => ({ ...prev, jobLevel: val }))
            }
            options={jobLevels.map((level) => ({
              label: level,
              value: level,
            }))}
            placeholder="Select job level"
            allowClear
            showSearch
          />
        </div>
      </div>
      {/* Location */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <label className="block font-medium mb-2">Location</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div>
            <label className="block text-sm mb-1">Country</label>
            <input
              className="w-full border rounded px-3 py-2"
              name="country"
              placeholder="Country"
              value={form.country}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">City</label>
            <input
              className="w-full border rounded px-3 py-2"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
            />
          </div>
        </div>
        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            name="remote"
            checked={form.remote}
            onChange={handleChange}
          />
          <span>
            Fully Remote Position - <span className="font-semibold">Worldwide</span>
          </span>
        </label>
      </div>
      {/* Job Benefits */}
      <div className="mb-6">
        <label className="block font-medium mb-2">Job Benefits</label>
        <div className="flex flex-wrap gap-2">
          {benefitsList.map((benefit) => (
            <button
              type="button"
              key={benefit}
              className={`px-3 py-1 rounded border text-sm ${
                form.benefits.includes(benefit)
                  ? "bg-blue-100 border-blue-400 text-blue-700"
                  : "bg-gray-100 border-gray-200 text-gray-700"
              }`}
              onClick={() => handleBenefitToggle(benefit)}
            >
              {benefit}
            </button>
          ))}
        </div>
      </div>
      {/* Job Description */}
      <div className="mb-6">
        <label className="block font-medium mb-1">Job Description</label>
        <textarea
          className="w-full border rounded px-3 py-2 min-h-[120px]"
          name="description"
          placeholder="Add your job description..."
          value={form.description}
          onChange={handleChange}
        />
      </div>
      {/* Job Requirements */}
      <div className="mb-6">
        <label className="block font-medium mb-1">Job Requirements</label>
        <textarea
          className="w-full border rounded px-3 py-2 min-h-[120px]"
          name="requirements"
          placeholder="Add your job requirements..."
          value={form.requirements}
          onChange={handleChange}
        />
      </div>
      {/* Job Desirable */}
      <div className="mb-6">
        <label className="block font-medium mb-1">Job Desirable</label>
        <textarea
          className="w-full border rounded px-3 py-2 min-h-[120px]"
          name="desirable"
          placeholder="Add your job description..."
          value={form.desirable}
          onChange={handleChange}
        />
      </div>
      {/* Apply Job On */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <label className="block font-medium mb-2">Apply Job on:</label>
        <div className="flex flex-col md:flex-row gap-4">
          {["Jobpilot", "external", "email"].map((type) => (
            <label
              key={type}
              className={`flex-1 flex items-start gap-2 p-4 rounded cursor-pointer border ${
                form.applyType === type
                  ? "bg-white border-blue-400 shadow"
                  : "bg-gray-50 border-transparent"
              }`}
            >
              <input
                type="radio"
                name="applyType"
                value={type}
                checked={form.applyType === type}
                onChange={handleChange}
                className="mt-1"
              />
              <div>
                <div className="font-semibold">
                  {type === "Jobpilot"
                    ? "On Jobpilot"
                    : type === "external"
                    ? "External Platform"
                    : "On Your Email"}
                </div>
                <div className="text-xs text-gray-500">
                  {type === "Jobpilot"
                    ? "Candidate will apply job using jobpilot & all application will show on your dashboard."
                    : type === "external"
                    ? "Candidate apply job on your website, all application on your own website."
                    : "Candidate apply job on your email address, and all application in your email."}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>
      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 flex items-center gap-2"
      >
        Post Job <span>→</span>
      </button>
    </form>
  );
}