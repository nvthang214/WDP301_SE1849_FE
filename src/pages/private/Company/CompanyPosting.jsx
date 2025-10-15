import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CompanyService } from "../../../services/CompanyService";
import ROUTER from "../../../router/ROUTER";

const CompanyPosting = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    banner: "",
    description: "",
    benefits: "",
    vision: "",
    social: {
      facebook: "",
      linkedin: "",
      twitter: "",
      youtube: "",
    },
    contact: {
      email: "",
      phone: "",
      website: "",
    },
    foundedDate: "",
    teamSize: "",
    address: "",
    industry: "",
  });

  const steps = [
    { id: 0, name: "Company Info", icon: "🔍" },
    { id: 1, name: "Founding Info", icon: "👤" },
    { id: 2, name: "Social Media Profile", icon: "🌐" },
    { id: 3, name: "Contact", icon: "@" }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0:
        if (!formData.name.trim()) {
          alert("Vui lòng nhập tên công ty");
          return false;
        }
        if (!formData.description.trim()) {
          alert("Vui lòng nhập mô tả công ty");
          return false;
        }
        break;
      case 1:
        if (!formData.industry.trim()) {
          alert("Vui lòng nhập ngành nghề");
          return false;
        }
        if (!formData.teamSize || formData.teamSize <= 0) {
          alert("Vui lòng nhập quy mô team hợp lệ");
          return false;
        }
        break;
      case 2:
        // Social media là optional, không cần validate
        break;
      case 3:
        if (!formData.contact.email.trim()) {
          alert("Vui lòng nhập email liên hệ");
          return false;
        }
        if (!formData.contact.email.includes('@')) {
          alert("Email không hợp lệ");
          return false;
        }
        if (!formData.address.trim()) {
          alert("Vui lòng nhập địa chỉ công ty");
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateAllSteps = () => {
    // Validate tất cả các bước
    for (let step = 0; step < steps.length; step++) {
      const originalStep = currentStep;
      setCurrentStep(step);
      
      if (!validateCurrentStep()) {
        setCurrentStep(originalStep);
        return false;
      }
    }
    setCurrentStep(currentStep);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate tất cả các bước trước khi submit
    if (!validateAllSteps()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        teamSize: parseInt(formData.teamSize),
        foundedDate: formData.foundedDate ? new Date(formData.foundedDate) : null
      };
      
      const response = await CompanyService.createCompany(submitData);
      
      if (response && response.isOk !== false) {
        alert("Tạo công ty thành công!");
        navigate(ROUTER.COMPANIES);
      } else {
        alert("Tạo công ty thất bại");
      }
    } catch (error) {
      console.error("Error creating company:", error);
      console.error("Error details:", error.response?.data || error.message);
      alert(`Có lỗi xảy ra khi tạo công ty: ${error.response?.data?.msg || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            {/* Logo & Banner Image */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Logo & Banner Image</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Logo</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <div className="text-gray-400 mb-2">
                      <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Browse photo or drop here</p>
                    <p className="text-xs text-gray-500">A photo larger than 400 pixels work best. Max photo size 5 MB.</p>
                  </div>
                  <input
                    type="url"
                    name="logo"
                    value={formData.logo}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Or paste logo URL here"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <div className="text-gray-400 mb-2">
                      <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">Browse photo or drop here</p>
                    <p className="text-xs text-gray-500">Banner images optical dimension 1520x400. Supported format JPEG, PNG. Max photo size 5 MB.</p>
                  </div>
                  <input
                    type="url"
                    name="banner"
                    value={formData.banner}
                    onChange={handleInputChange}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Or paste banner URL here"
                  />
                </div>
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !formData.name.trim() ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter company name"
              />
              {!formData.name.trim() && (
                <p className="text-red-500 text-xs mt-1">Tên công ty là bắt buộc</p>
              )}
            </div>

            {/* About Us */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                About Us <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !formData.description.trim() ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Write down about your company here. Let the candidate know who we are..."
              />
              {!formData.description.trim() && (
                <p className="text-red-500 text-xs mt-1">Mô tả công ty là bắt buộc</p>
              )}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Select...</option>
                  <option>Corporation</option>
                  <option>LLC</option>
                  <option>Partnership</option>
                  <option>Sole Proprietorship</option>
                </select>
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry Types <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !formData.industry.trim() ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Select..."
                />
                {!formData.industry.trim() && (
                  <p className="text-red-500 text-xs mt-1">Ngành nghề là bắt buộc</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Size <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleInputChange}
                  min="1"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !formData.teamSize || formData.teamSize <= 0 ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Select..."
                />
                {(!formData.teamSize || formData.teamSize <= 0) && (
                  <p className="text-red-500 text-xs mt-1">Quy mô team phải lớn hơn 0</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year of Establishment</label>
                <div className="relative">
                  <input
                    type="date"
                    name="foundedDate"
                    value={formData.foundedDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="dd/mm/yyyy"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Website</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    name="contact.website"
                    value={formData.contact.website}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Website url..."
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Vision</label>
              <textarea
                name="vision"
                value={formData.vision}
                onChange={handleInputChange}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about your company vision..."
              />
              {/* Rich Text Editor Toolbar */}
              {/* <div className="mt-2 flex space-x-2">
                <button type="button" className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">B</button>
                <button type="button" className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">I</button>
                <button type="button" className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">U</button>
                <button type="button" className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">S</button>
                <button type="button" className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">🔗</button>
                <button type="button" className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">•</button>
                <button type="button" className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">1.</button>
              </div> */}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Link</h3>
            
            {/* Social Media Links */}
            {/* Social Media Links */}
<div className="space-y-4">
  {/* Facebook */}
  <div className="flex items-center space-x-4">
    <div className="w-32 font-medium">Facebook</div>
    <div className="flex-1">
      <input
        type="url"
        name="social.facebook"
        value={formData.social.facebook}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Facebook profile link..."
      />
    </div>
  </div>

  {/* LinkedIn */}
  <div className="flex items-center space-x-4">
    <div className="w-32 font-medium">LinkedIn</div>
    <div className="flex-1">
      <input
        type="url"
        name="social.linkedin"
        value={formData.social.linkedin}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="LinkedIn profile link..."
      />
    </div>
  </div>

  {/* Twitter */}
  <div className="flex items-center space-x-4">
    <div className="w-32 font-medium">Twitter</div>
    <div className="flex-1">
      <input
        type="url"
        name="social.twitter"
        value={formData.social.twitter}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Twitter profile link..."
      />
    </div>
  </div>

  {/* YouTube */}
  <div className="flex items-center space-x-4">
    <div className="w-32 font-medium">YouTube</div>
    <div className="flex-1">
      <input
        type="url"
        name="social.youtube"
        value={formData.social.youtube}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="YouTube channel link..."
      />
    </div>
  </div>
</div>


            {/* <button type="button" className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
              <div className="flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add New Social Link</span>
              </div>
            </button> */}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Map Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !formData.address.trim() ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter company address"
              />
              {!formData.address.trim() && (
                <p className="text-red-500 text-xs mt-1">Địa chỉ công ty là bắt buộc</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <div className="flex space-x-2">
                <div className="w-24">
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>🇧🇩 +880</option>
                    <option>🇻🇳 +84</option>
                    <option>🇺🇸 +1</option>
                    <option>🇬🇧 +44</option>
                  </select>
                </div>
                <div className="flex-1">
                  <input
                    type="tel"
                    name="contact.phone"
                    value={formData.contact.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Phone number.."
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="contact.email"
                  value={formData.contact.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !formData.contact.email.trim() || !formData.contact.email.includes('@') ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Email address"
                />
              </div>
              {!formData.contact.email.trim() && (
                <p className="text-red-500 text-xs mt-1">Email liên hệ là bắt buộc</p>
              )}
              {formData.contact.email.trim() && !formData.contact.email.includes('@') && (
                <p className="text-red-500 text-xs mt-1">Email không hợp lệ</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the benefits your company provides..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tạo Công Ty Mới</h1>
              <p className="text-gray-600 mt-1">Điền thông tin công ty của bạn</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Quay lại
            </button>
          </div>
        </div>

        {/* Steps Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep === step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : currentStep > step.id 
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-medium">{step.icon}</span>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    currentStep === step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`ml-8 w-16 h-0.5 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div>
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`px-6 py-2 rounded-md ${
                  currentStep === 0 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } transition-colors`}
              >
                Previous
              </button>
              
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <span>Save & Next</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <span>{isSubmitting ? "Đang tạo..." : "Finish Editing"}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPosting;