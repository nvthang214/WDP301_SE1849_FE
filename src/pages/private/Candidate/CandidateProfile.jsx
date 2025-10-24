import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Select, Spin, Typography } from "antd";
import { CandidateService } from "../../../services/CandidateService";
import { TagService } from "../../../services/TagService";
import { notifyError, notifySuccess } from "../../../components/Notification";
import SettingsHeader from "./components/Header";
import useAuthStore from "../../../store/useAuthStore";

const { Text, Title } = Typography;
const { TextArea } = Input;

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
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [tags, setTags] = useState([]);
  const [isTagsLoading, setIsTagsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({ ...defaultFormValues });
  // lấy user từ authstore
  const { user,loading } = useAuthStore();
  const userId = useMemo(() => user?._id || user?.id || user?.userId || null, [user]);

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
    if (loading) return;

    if (!userId) {
      notifyError("Không tìm thấy thông tin người dùng, vui lòng đăng nhập lại.");
      setIsLoading(false);
      return;
    }

    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await CandidateService.getCandidateProfile(userId);
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
  }, [loading, form, userId]);

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
            style={{ maxWidth: 1200 }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Form.Item
                name="education"
                label="Education"
                rules={[{ max: 1000, message: "Tối đa 1000 ký tự." }]}
              >
                <Input
                  size="large"
                  allowClear
                  placeholder="Your education"
                />
              </Form.Item>

              <Form.Item
                name="experience"
                label="Experience"
                rules={[{ max: 1000, message: "Tối đa 1000 ký tự." }]}
              >
                <Input
                  size="large"
                  allowClear
                  placeholder="Your experience"
                />
              </Form.Item>

              <Form.Item
                name="location"
                label="Location"
                rules={[{ max: 100, message: "Tối đa 100 ký tự." }]}
              >
                <Input size="large" placeholder="City,state,country name" allowClear />
              </Form.Item>

              <Form.Item name="tags" label="Tags">
                <Select
                  size="large"
                  mode="multiple"
                  allowClear
                  loading={isTagsLoading}
                  placeholder="Select or type tags"
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
                size="large"
                rows={6}
                placeholder="Write down your biography here. Let the employers know who you are..."
                allowClear
              />
            </Form.Item>

            <Form.Item>
              <div className="flex justify-end gap-3">
                <Button type="primary" htmlType="submit" loading={isSubmitting} size="large">
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
