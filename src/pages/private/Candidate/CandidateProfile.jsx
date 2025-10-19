import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Select, Spin, Typography } from "antd";
import { CandidateService } from "../../../services/CandidateService";
import { TagService } from "../../../services/TagService";
import { notifyError, notifySuccess } from "../../../components/Notification";
import SettingsHeader from "./components/Header";

const { Text, Title } = Typography;
const { TextArea } = Input;

const EXPERIENCE_PRESETS = [
  { value: "Intern", label: "Intern" },
  { value: "Junior", label: "Junior" },
  { value: "Mid-level", label: "Mid-level" },
  { value: "Senior", label: "Senior" },
  { value: "Lead", label: "Lead" },
  { value: "Principal", label: "Principal" },
];

const EDUCATION_PRESETS = [
  { value: "High School", label: "High School" },
  { value: "Associate", label: "Associate" },
  { value: "Bachelor", label: "Bachelor" },
  { value: "Master", label: "Master" },
  { value: "PhD", label: "PhD" },
  { value: "Certification", label: "Certification" },
];

const decodeAccessToken = (token) => {
  if (!token) return null;
  try {
    const [, payload = ""] = token.split(".");
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split("")
        .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode access token", error);
    return null;
  }
};

const defaultFormValues = {
  experience: "",
  education: "",
  bio: "",
  location: "",
  tags: [],
};

const extractFormValues = (profile) => {
  if (!profile || typeof profile !== "object") return { ...defaultFormValues };

  return {
    experience: profile.experience || "",
    education: profile.education || "",
    bio: profile.bio || "",
    location: profile.location || "",
    tags: Array.isArray(profile.tags)
      ? profile.tags.map((tag) => (typeof tag === "string" ? tag : tag?._id)).filter(Boolean)
      : [],
  };
};

const CandidateProfile = () => {
  const [form] = Form.useForm();
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [tags, setTags] = useState([]);
  const [isTagsLoading, setIsTagsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({ ...defaultFormValues });
  const watchedExperience = Form.useWatch("experience", form);
  const watchedEducation = Form.useWatch("education", form);

  const mergedExperienceOptions = useMemo(() => {
    if (!watchedExperience) return EXPERIENCE_PRESETS;
    if (EXPERIENCE_PRESETS.some((item) => item.value === watchedExperience)) return EXPERIENCE_PRESETS;
    return [{ value: watchedExperience, label: watchedExperience }, ...EXPERIENCE_PRESETS];
  }, [watchedExperience]);

  const mergedEducationOptions = useMemo(() => {
    if (!watchedEducation) return EDUCATION_PRESETS;
    if (EDUCATION_PRESETS.some((item) => item.value === watchedEducation)) return EDUCATION_PRESETS;
    return [{ value: watchedEducation, label: watchedEducation }, ...EDUCATION_PRESETS];
  }, [watchedEducation]);

  const tokenPayload = useMemo(() => {
    const token = localStorage.getItem("accessToken");
    return decodeAccessToken(token);
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      setIsTagsLoading(true);
      try {
        const response = await TagService.getAllTags();
        setTags(Array.isArray(response?.data) ? response.data : []);
      } catch (error) {
        console.error(error);
        setTags([]);
      } finally {
        setIsTagsLoading(false);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    if (!tokenPayload?.userId) {
      notifyError("Không tìm thấy thông tin người dùng, vui lòng đăng nhập lại.");
      setIsLoading(false);
      return;
    }

    setUserId(tokenPayload.userId);
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await CandidateService.getCandidateProfile(tokenPayload.userId);
        if (response?.isError) {
          if (response.statusCode !== 404) {
            notifyError(response?.msg || "Không thể tải hồ sơ ứng viên.");
          }
          setIsNewProfile(true);
          setInitialValues({ ...defaultFormValues });
          form.setFieldsValue({ ...defaultFormValues });
          return;
        }

        setIsNewProfile(false);
        const extracted = extractFormValues(response?.data);
        setInitialValues(extracted);
        form.setFieldsValue(extracted);
      } catch (error) {
        console.error(error);
        notifyError("Không thể tải hồ sơ ứng viên.");
        setIsNewProfile(true);
        setInitialValues({ ...defaultFormValues });
        form.setFieldsValue({ ...defaultFormValues });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [form, tokenPayload]);

  const handleSubmit = async (values) => {
    if (!userId) {
      notifyError("Không xác định được người dùng.");
      return;
    }

    const payload = {
      experience: values.experience?.trim() || "",
      education: values.education?.trim() || "",
      bio: values.bio?.trim() || "",
      location: values.location?.trim() || "",
      tags: Array.isArray(values.tags) ? values.tags : [],
    };

    setIsSubmitting(true);
    try {
      const action = isNewProfile
        ? CandidateService.addCandidateProfile(userId, payload)
        : CandidateService.updateCandidateProfile(userId, payload);

      const response = await action;
      if (response?.isError) {
        throw new Error(response?.msg || "Không thể lưu hồ sơ ứng viên.");
      }

      setIsNewProfile(false);
      const extracted = extractFormValues(response?.data);
      setInitialValues(extracted);
      form.setFieldsValue(extracted);
      notifySuccess(response?.msg || "Đã lưu hồ sơ ứng viên.");
    } catch (error) {
      console.error(error);
      notifyError(error.message || "Không thể lưu hồ sơ ứng viên.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <SettingsHeader activeKey="profile" />
      <div>
        

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onFinish={handleSubmit}
            style={{ maxWidth: 860 }}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <Form.Item
                name="education"
                label="Education"
                rules={[{ max: 1000, message: "Tối đa 1000 ký tự." }]}
              >
                <Select
                  allowClear
                  placeholder="Select..."
                  options={mergedEducationOptions}
                  showSearch
                  optionFilterProp="label"
                />
              </Form.Item>

              <Form.Item
                name="experience"
                label="Experience"
                rules={[{ max: 1000, message: "Tối đa 1000 ký tự." }]}
              >
                <Select
                  allowClear
                  placeholder="Select..."
                  options={mergedExperienceOptions}
                  showSearch
                  optionFilterProp="label"
                />
              </Form.Item>

              <Form.Item
                name="location"
                label="Location"
                rules={[{ max: 100, message: "Tối đa 100 ký tự." }]}
              >
                <Input placeholder="Where are you based?" allowClear />
              </Form.Item>

              <Form.Item name="tags" label="Tags">
                <Select
                  mode="multiple"
                  allowClear
                  loading={isTagsLoading}
                  placeholder="Select or type skills"
                  options={tags.map((tag) => ({
                    label: tag.name,
                    value: tag._id,
                  }))}
                  optionFilterProp="label"
                />
              </Form.Item>
            </div>

            <Form.Item
              name="bio"
              label="Biography"
              rules={[{ max: 500, message: "Tối đa 500 ký tự." }]}
            >
              <TextArea
                rows={6}
                placeholder="Write down your biography here. Let the employers know who you are..."
                allowClear
              />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-end gap-3">
                <Button type="primary" htmlType="submit" loading={isSubmitting}>
                  Save changes 
                </Button>
              </div>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

export default CandidateProfile;
