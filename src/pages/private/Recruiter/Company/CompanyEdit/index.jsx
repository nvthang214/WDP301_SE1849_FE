import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Building2, ArrowLeft } from "lucide-react";
import { CompanyService } from "../../../../../services/CompanyService";

export default function CompanyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    banner: "",
    description: "",
    industry: "",
    teamSize: "",
    address: "",
    contact: {
      email: "",
      phone: "",
      website: "",
    },
    social: {
      facebook: "",
      linkedin: "",
      twitter: "",
      youtube: "",
    },
    benefits: "",
    vision: "",
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setInitialLoading(true);
        const response = await CompanyService.getCompanyById(id);
        const company = response?.data;
        if (company) {
          setFormData({
            name: company.name || "",
            logo: company.logo || "",
            banner: company.banner || "",
            description: company.description || "",
            industry: company.industry || "",
            teamSize: company.teamSize || "",
            address: company.address || "",
            contact: {
              email: company.contact?.email || "",
              phone: company.contact?.phone || "",
              website: company.contact?.website || "",
            },
            social: {
              facebook: company.social?.facebook || "",
              linkedin: company.social?.linkedin || "",
              twitter: company.social?.twitter || "",
              youtube: company.social?.youtube || "",
            },
            benefits: company.benefits || "",
            vision: company.vision || "",
          });
        }
      } catch (error) {
        console.error("Failed to load company:", error);
        alert("Failed to load company information.");
        navigate("/recruiter/company/my-company");
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchCompany();
    }
  }, [id, navigate]);

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

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB for better performance)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB for better performance");
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file");
        return;
      }

      // Compress and resize image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Set max dimensions
        const maxWidth = field === 'logo' ? 200 : 800;
        const maxHeight = field === 'logo' ? 200 : 400;
        
        let { width, height } = img;
        
        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with compression
        const base64 = canvas.toDataURL('image/jpeg', 0.8); // 80% quality
        
        console.log(`File uploaded for ${field}:`, {
          name: file.name,
          originalSize: file.size,
          compressedSize: base64.length,
          dimensions: `${width}x${height}`,
          compression: `${Math.round((1 - base64.length / file.size) * 100)}%`
        });
        
        setFormData(prev => ({
          ...prev,
          [field]: base64
        }));
      };
      
      img.onerror = () => {
        alert("Error loading image. Please try again.");
      };
      
      img.src = URL.createObjectURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        teamSize: parseInt(formData.teamSize) || 0,
      };
      
      await CompanyService.updateCompany(id, submitData);
      alert("Company updated successfully!");
      navigate("/recruiter/company/my-company");
    } catch (error) {
      console.error("Failed to update company:", error);
      alert("Failed to update company. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white shadow-[var(--shadow-md)] p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-neutral-200)] text-[var(--color-neutral-500)] transition hover:border-[var(--color-primary-300)] hover:text-[var(--color-primary-600)]"
        >
          <ArrowLeft size={18} strokeWidth={1.6} />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">
            Edit Company
          </h1>
          <p className="mt-1 text-sm text-[var(--color-neutral-500)]">
            Update your company information.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white shadow-[var(--shadow-md)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-6">
            Company Information
          </h2>
          
          {/* Company Name - Full Width */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
              Company Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder-[var(--color-neutral-400)] focus:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
              placeholder="Enter company name"
            />
          </div>

          {/* Logo and Banner Section */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Company Logo */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                Company Logo
              </label>
              <div className="space-y-3">
                <input
                  type="url"
                  name="logo"
                  value={formData.logo}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder-[var(--color-neutral-400)] focus:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                  placeholder="Enter logo URL"
                />
                <div className="text-center text-sm text-[var(--color-neutral-500)]">OR</div>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'logo')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="logo-upload-edit"
                  />
                  <label 
                    htmlFor="logo-upload-edit"
                    className="flex items-center justify-center w-full h-12 border-2 border-dashed border-[var(--color-neutral-300)] rounded-xl hover:border-[var(--color-primary-300)] transition-colors cursor-pointer"
                  >
                    <span className="text-sm text-[var(--color-neutral-600)]">Upload Logo (Max 2MB)</span>
                  </label>
                </div>
                {formData.logo && (
                  <div className="mt-2 text-center">
                    <img 
                      src={formData.logo} 
                      alt="Logo preview" 
                      className="w-20 h-20 object-cover rounded-lg border border-[var(--color-neutral-200)] mx-auto"
                    />
                    <p className="text-xs text-[var(--color-neutral-500)] mt-1">Logo Preview</p>
                  </div>
                )}
              </div>
            </div>

            {/* Company Banner */}
            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                Company Banner
              </label>
              <div className="space-y-3">
                <input
                  type="url"
                  name="banner"
                  value={formData.banner}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder-[var(--color-neutral-400)] focus:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                  placeholder="Enter banner URL"
                />
                <div className="text-center text-sm text-[var(--color-neutral-500)]">OR</div>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'banner')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="banner-upload-edit"
                  />
                  <label 
                    htmlFor="banner-upload-edit"
                    className="flex items-center justify-center w-full h-12 border-2 border-dashed border-[var(--color-neutral-300)] rounded-xl hover:border-[var(--color-primary-300)] transition-colors cursor-pointer"
                  >
                    <span className="text-sm text-[var(--color-neutral-600)]">Upload Banner (Max 2MB)</span>
                  </label>
                </div>
                {formData.banner && (
                  <div className="mt-2">
                    <img 
                      src={formData.banner} 
                      alt="Banner preview" 
                      className="w-full h-20 object-cover rounded-lg border border-[var(--color-neutral-200)]"
                    />
                    <p className="text-xs text-[var(--color-neutral-500)] mt-1 text-center">Banner Preview</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                Industry
              </label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder-[var(--color-neutral-400)] focus:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                placeholder="e.g., Technology, Healthcare"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                Team Size
              </label>
              <input
                type="number"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleInputChange}
                min="1"
                className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder-[var(--color-neutral-400)] focus:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                placeholder="Number of employees"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder-[var(--color-neutral-400)] focus:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                placeholder="Company address"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
              Company Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder-[var(--color-neutral-400)] focus:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
              placeholder="Tell us about your company..."
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white shadow-[var(--shadow-md)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-6">
            Contact Information
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                Email
              </label>
              <input
                type="email"
                name="contact.email"
                value={formData.contact.email}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder-[var(--color-neutral-400)] focus:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                placeholder="company@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="contact.phone"
                value={formData.contact.phone}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder-[var(--color-neutral-400)] focus:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                placeholder="+84 123 456 789"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                Website
              </label>
              <input
                type="url"
                name="contact.website"
                value={formData.contact.website}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder-[var(--color-neutral-400)] focus:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                placeholder="https://www.company.com"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white shadow-[var(--shadow-md)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-6">
            Social Media
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                Facebook
              </label>
              <input
                type="url"
                name="social.facebook"
                value={formData.social.facebook}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder-[var(--color-neutral-400)] focus:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                placeholder="https://facebook.com/company"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                LinkedIn
              </label>
              <input
                type="url"
                name="social.linkedin"
                value={formData.social.linkedin}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder-[var(--color-neutral-400)] focus:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                placeholder="https://linkedin.com/company/company"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                Twitter
              </label>
              <input
                type="url"
                name="social.twitter"
                value={formData.social.twitter}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder-[var(--color-neutral-400)] focus:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                placeholder="https://twitter.com/company"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                YouTube
              </label>
              <input
                type="url"
                name="social.youtube"
                value={formData.social.youtube}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder-[var(--color-neutral-400)] focus:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                placeholder="https://youtube.com/@company"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--color-neutral-200)] bg-white shadow-[var(--shadow-md)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-6">
            Additional Information
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                Benefits
              </label>
              <textarea
                name="benefits"
                value={formData.benefits}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder-[var(--color-neutral-400)] focus:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                placeholder="Describe the benefits your company provides..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-neutral-700)] mb-2">
                Company Vision
              </label>
              <textarea
                name="vision"
                value={formData.vision}
                onChange={handleInputChange}
                rows={3}
                className="w-full rounded-xl border border-[var(--color-neutral-200)] px-4 py-3 text-[var(--color-neutral-900)] placeholder-[var(--color-neutral-400)] focus:border-[var(--color-primary-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-100)]"
                placeholder="Tell us about your company vision..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-[var(--color-neutral-200)] bg-white px-6 py-3 text-sm font-semibold text-[var(--color-neutral-700)] transition hover:border-[var(--color-primary-300)] hover:text-[var(--color-primary-600)]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary-500)] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--color-primary-600)] disabled:opacity-50"
          >
            <Building2 size={16} />
            {loading ? "Updating..." : "Update Company"}
          </button>
        </div>
      </form>
    </div>
  );
}
