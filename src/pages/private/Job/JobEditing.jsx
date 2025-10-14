import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
          company: res.data.company?._id || res.data.company || "",
          recruiter:
            res.data.recruiter && res.data.recruiter._id
              ? res.data.recruiter._id
              : "68ebccd50612c5184b23abbe",
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
          expiration: res.data.expiration
            ? res.data.expiration.slice(0, 10)
            : "",
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
          isActive:
            typeof res.data.isActive === "boolean" ? res.data.isActive : true,
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
      expiration: form.expiration
        ? new Date(form.expiration).toISOString()
        : "",
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

  if (loading)
    return <div className="text-center py-10 text-gray-400">Loading...</div>;

  return (
    <form className="max-w-5xl mx-auto py-8" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-semibold mb-6">Edit Job</h2>
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

      {/* Salary */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
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
        <div className="">
          <div>
            <label className="block font-medium mb-1">Salary Type</label>
            <Select
              className="w-full border rounded-l px-3 py-2"
              style={{ width: "100%" }}
              value={form.salaryType ? [form.salaryType] : []}
              onChange={(val) =>
                setForm((prev) => ({ ...prev, salaryType: val[0] || "" }))
              }
              options={[
                { label: "Monthly", value: "Monthly" },
                { label: "Yearly", value: "Yearly" },
                { label: "USD", value: "USD" },
              ]}
              mode="multiple"
              maxTagCount={1}
              placeholder="Select salary type"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium mb-1">Category</label>
          <Select
            style={{ width: "100%" }}
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
      {/* Advance Information */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block font-medium mb-1">Education</label>
          <Select
            style={{ width: "100%" }}
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
          <label className="block font-medium mb-1">Experience</label>
          <input
            className="w-full border rounded px-3 py-2"
            name="experience"
            placeholder="Experience"
            value={form.experience}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Job Type</label>
          <Select
            style={{ width: "100%" }}
            value={form.jobType ? [form.jobType] : []}
            onChange={(val) =>
              setForm((prev) => ({ ...prev, jobType: val[0] || "" }))
            }
            options={jobTypes.map((type) => ({ label: type, value: type }))}
            mode="multiple"
            maxTagCount={1}
            placeholder="Select job type"
          />
        </div>
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
        <div>
          <label className="block font-medium mb-1">Job Level</label>
          <Select
            style={{ width: "100%" }}
            value={form.jobLevel ? [form.jobLevel] : []}
            onChange={(val) =>
              setForm((prev) => ({ ...prev, jobLevel: val[0] || "" }))
            }
            options={jobLevels.map((level) => ({ label: level, value: level }))}
            mode="multiple"
            maxTagCount={1}
            placeholder="Select job level"
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
            Fully Remote Position -{" "}
            <span className="font-semibold">Worldwide</span>
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
        Update Job <span>→</span>
      </button>
    </form>
  );
}
