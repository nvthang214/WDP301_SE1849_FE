import React, { useState } from "react";
import { JobService } from "../../../services/JobService";

const jobTypes = ["FULL-TIME", "PART-TIME", "INTERNSHIP", "TEMPORARY", "CONTRACT BASE"];
const jobLevels = ["Intern", "Fresher", "Junior", "Middle", "Senior", "Lead"];
const benefitsList = [
  "401k Salary", "Distributed Team", "Async", "Vision Insurance", "Dental Insurance", "Medical Insurance", "Unlimited vacation",
  "4 day workweek", "401k matching", "company retreats", "Learning budget", "Free gym membership", "Pay in crypto",
  "Profit Sharing", "Equity Compensation", "No whiteboard interview", "No politics at work", "We hire old (and young)"
];

export default function JobPosting() {
  const [form, setForm] = useState({
    title: "",
    tags: "",
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
    applyType: "jobpilot",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gửi form lên backend tại đây
    JobService.postJob(form)
      .then((response) => {
        alert("Job posted successfully!");
      })
      .catch((error) => {
        alert("Failed to post job:\n" + error.message);
      });
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
          <input
            className="w-full border rounded px-3 py-2"
            name="tags"
            placeholder="Job keyword, tags etc..."
            value={form.tags}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Job Role</label>
          <select
            className="w-full border rounded px-3 py-2"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            <option value="Developer">Developer</option>
            <option value="Designer">Designer</option>
            <option value="Manager">Manager</option>
            {/* Thêm các role khác nếu cần */}
          </select>
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
            <span className="bg-gray-100 px-3 py-2 rounded-r border border-l-0">USD</span>
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
            <span className="bg-gray-100 px-3 py-2 rounded-r border border-l-0">USD</span>
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Salary Type</label>
          <select
            className="w-full border rounded px-3 py-2"
            name="salaryType"
            value={form.salaryType}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </div>
      </div>
      {/* Advance Information */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block font-medium mb-1">Education</label>
          <select
            className="w-full border rounded px-3 py-2"
            name="education"
            value={form.education}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            <option value="Graduation">Graduation</option>
            <option value="Master">Master</option>
            <option value="PhD">PhD</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Experience</label>
          <select
            className="w-full border rounded px-3 py-2"
            name="experience"
            value={form.experience}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            <option value="0-1">0-1 years</option>
            <option value="1-3">1-3 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5+">5+ years</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Job Type</label>
          <select
            className="w-full border rounded px-3 py-2"
            name="jobType"
            value={form.jobType}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Vacancies</label>
          <select
            className="w-full border rounded px-3 py-2"
            name="vacancies"
            value={form.vacancies}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            {[1,2,3,4,5,6,7,8,9,10].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
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
          <select
            className="w-full border rounded px-3 py-2"
            name="jobLevel"
            value={form.jobLevel}
            onChange={handleChange}
          >
            <option value="">Select...</option>
            {jobLevels.map((level) => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Location */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <label className="block font-medium mb-2">Location</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          <div>
            <label className="block text-sm mb-1">Country</label>
            <select
              className="w-full border rounded px-3 py-2"
              name="country"
              value={form.country}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              <option value="Vietnam">Vietnam</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              {/* Thêm các quốc gia khác nếu cần */}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">City</label>
            <select
              className="w-full border rounded px-3 py-2"
              name="city"
              value={form.city}
              onChange={handleChange}
            >
              <option value="">Select...</option>
              <option value="Hanoi">Hanoi</option>
              <option value="Ho Chi Minh">Ho Chi Minh</option>
              <option value="London">London</option>
              <option value="New York">New York</option>
              {/* Thêm các thành phố khác nếu cần */}
            </select>
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
        {/* Toolbar giả lập */}
        <div className="flex gap-2 mt-2 text-gray-400">
          <button type="button" className="hover:text-blue-500"><b>B</b></button>
          <button type="button" className="hover:text-blue-500"><i>I</i></button>
          <button type="button" className="hover:text-blue-500">U</button>
          <button type="button" className="hover:text-blue-500">🔗</button>
          <button type="button" className="hover:text-blue-500">•</button>
        </div>
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
        {/* Toolbar giả lập */}
        <div className="flex gap-2 mt-2 text-gray-400">
          <button type="button" className="hover:text-blue-500"><b>B</b></button>
          <button type="button" className="hover:text-blue-500"><i>I</i></button>
          <button type="button" className="hover:text-blue-500">U</button>
          <button type="button" className="hover:text-blue-500">🔗</button>
          <button type="button" className="hover:text-blue-500">•</button>
        </div>
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
        {/* Toolbar giả lập */}
        <div className="flex gap-2 mt-2 text-gray-400">
          <button type="button" className="hover:text-blue-500"><b>B</b></button>
          <button type="button" className="hover:text-blue-500"><i>I</i></button>
          <button type="button" className="hover:text-blue-500">U</button>
          <button type="button" className="hover:text-blue-500">🔗</button>
          <button type="button" className="hover:text-blue-500">•</button>
        </div>
      </div>      
      {/* Apply Job On */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <label className="block font-medium mb-2">Apply Job on:</label>
        <div className="flex flex-col md:flex-row gap-4">
          <label className={`flex-1 flex items-start gap-2 p-4 rounded cursor-pointer border ${form.applyType === "jobpilot" ? "bg-white border-blue-400 shadow" : "bg-gray-50 border-transparent"}`}>
            <input
              type="radio"
              name="applyType"
              value="jobpilot"
              checked={form.applyType === "jobpilot"}
              onChange={handleChange}
              className="mt-1"
            />
            <div>
              <div className="font-semibold">On Jobpilot</div>
              <div className="text-xs text-gray-500">Candidate will apply job using jobpilot &amp; all application will show on your dashboard.</div>
            </div>
          </label>
          <label className={`flex-1 flex items-start gap-2 p-4 rounded cursor-pointer border ${form.applyType === "external" ? "bg-white border-blue-400 shadow" : "bg-gray-50 border-transparent"}`}>
            <input
              type="radio"
              name="applyType"
              value="external"
              checked={form.applyType === "external"}
              onChange={handleChange}
              className="mt-1"
            />
            <div>
              <div className="font-semibold">External Platform</div>
              <div className="text-xs text-gray-500">Candidate apply job on your website, all application on your own website.</div>
            </div>
          </label>
          <label className={`flex-1 flex items-start gap-2 p-4 rounded cursor-pointer border ${form.applyType === "email" ? "bg-white border-blue-400 shadow" : "bg-gray-50 border-transparent"}`}>
            <input
              type="radio"
              name="applyType"
              value="email"
              checked={form.applyType === "email"}
              onChange={handleChange}
              className="mt-1"
            />
            <div>
              <div className="font-semibold">On Your Email</div>
              <div className="text-xs text-gray-500">Candidate apply job on your email address, and all application in your email.</div>
            </div>
          </label>
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