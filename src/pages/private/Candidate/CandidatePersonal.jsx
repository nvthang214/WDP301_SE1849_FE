import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Dropdown,
  Form,
  Input,
  Select,
  Spin,
  Typography,
  Upload,
} from "antd";
import {
  CloudUploadOutlined,
  DeleteOutlined,
  EditOutlined,
  FilePdfOutlined,
  MoreOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import SettingsHeader from "./components/Header";
import { CandidateService } from "../../../services/CandidateService";
import { UploadService } from "../../../services/UploadService";
import { notifyError, notifySuccess } from "../../../components/Notification";
import useAuthStore from "../../../store/useAuthStore";

const { Title, Text } = Typography;
const { Dragger } = Upload;

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

const AVATAR_MAX_SIZE = 5 * 1024 * 1024;
const CV_MAX_SIZE = 20 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

const defaultFormValues = {
  fullName: "",
  headline: "",
  experience: "",
  education: "",
  website: "",
};

const formatFileSize = (size) => {
  if (!size && size !== 0) return "";
  const kb = 1024;
  const mb = kb * 1024;
  if (size >= mb) return `${(size / mb).toFixed(1)} MB`;
  if (size >= kb) return `${(size / kb).toFixed(1)} KB`;
  return `${size} B`;
};

const CandidatePersonal = () => {
  const [form] = Form.useForm();
  const avatarInputRef = useRef(null);
  const cvInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAvatarBusy, setIsAvatarBusy] = useState(false);
  const [isCvBusy, setIsCvBusy] = useState(false);
  const [avatarData, setAvatarData] = useState(null);
  const [cvData, setCvData] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState({ firstName: "", lastName: "" });
  const [initialWebsite, setInitialWebsite] = useState("");
  // lấy user từ authstore
  const { user,loading } = useAuthStore();
  const userId = useMemo(() => user?._id || user?.id || user?.userId || null, [user]);

  const watchedExperience = Form.useWatch("experience", form);
  const watchedEducation = Form.useWatch("education", form);

  const mergedExperienceOptions = useMemo(() => {
    if (!watchedExperience) return EXPERIENCE_PRESETS;
    if (EXPERIENCE_PRESETS.some((option) => option.value === watchedExperience)) {
      return EXPERIENCE_PRESETS;
    }
    return [{ value: watchedExperience, label: watchedExperience }, ...EXPERIENCE_PRESETS];
  }, [watchedExperience]);

  const mergedEducationOptions = useMemo(() => {
    if (!watchedEducation) return EDUCATION_PRESETS;
    if (EDUCATION_PRESETS.some((option) => option.value === watchedEducation)) {
      return EDUCATION_PRESETS;
    }
    return [{ value: watchedEducation, label: watchedEducation }, ...EDUCATION_PRESETS];
  }, [watchedEducation]);

  useEffect(() => {
    if (loading) return;

    if (!userId) {
      notifyError("Không tìm thấy thông tin người dùng, vui lòng đăng nhập lại.");
      setIsLoading(false);
      return;
    }

    const loadInitialData = async () => {
      setIsLoading(true);
      const nextFormValues = { ...defaultFormValues };

      try {
        const [infoResult, profileResult, avatarResult, cvResult] = await Promise.allSettled([
          CandidateService.getInfoCandidate(userId),
          CandidateService.getCandidateProfile(userId),
          UploadService.getUserAvatar(userId),
          UploadService.getCandidateCv(userId),
        ]);

        if (infoResult.status === "fulfilled" && !infoResult.value?.isError) {
          const info = infoResult.value?.data || {};
          const firstName = info.firstName?.trim() || "";
          const lastName = info.lastName?.trim() || "";
          setCandidateInfo({ firstName, lastName });
          nextFormValues.fullName = [firstName, lastName].filter(Boolean).join(" ");
        } else if (infoResult.status === "fulfilled" && infoResult.value?.isError) {
          notifyError(infoResult.value?.msg || "Không thể tải thông tin cá nhân.");
        }

        if (profileResult.status === "fulfilled" && !profileResult.value?.isError) {
          const profile = profileResult.value?.data || {};
          setHasProfile(true);
          nextFormValues.headline = profile.bio || "";
          nextFormValues.experience = profile.experience || "";
          nextFormValues.education = profile.education || "";
          const website = profile.social?.linkedin || "";
          nextFormValues.website = website;
          setInitialWebsite(website);
        } else {
          setHasProfile(false);
          setInitialWebsite("");
        }

        if (avatarResult.status === "fulfilled" && !avatarResult.value?.isError) {
          setAvatarData(avatarResult.value?.data || null);
        } else {
          setAvatarData(null);
        }

        if (cvResult.status === "fulfilled" && !cvResult.value?.isError) {
          setCvData(cvResult.value?.data || null);
        } else {
          setCvData(null);
        }
      } catch (error) {
        console.error(error);
        notifyError("Không thể tải dữ liệu cá nhân.");
      } finally {
        form.setFieldsValue(nextFormValues);
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [loading, form, userId]);

  const validateAvatarFile = (file) => {
    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
      notifyError("Avatar chỉ hỗ trợ định dạng PNG, JPG hoặc WEBP.");
      return false;
    }
    if (file.size > AVATAR_MAX_SIZE) {
      notifyError("Kích thước ảnh tối đa 5 MB.");
      return false;
    }
    return true;
  };

  const validateCvFile = (file) => {
    if (file.type !== "application/pdf") {
      notifyError("CV phải là tệp PDF.");
      return false;
    }
    if (file.size > CV_MAX_SIZE) {
      notifyError("Kích thước CV tối đa 20 MB.");
      return false;
    }
    return true;
  };

  const handleAvatarUpload = async (file) => {
    if (!userId || !validateAvatarFile(file)) return;

    const formData = new FormData();
    formData.append("avatar", file);
    setIsAvatarBusy(true);

    try {
      const action = avatarData ? UploadService.updateUserAvatar : UploadService.addUserAvatar;
      const response = await action(userId, formData);
      if (response?.isError) {
        throw new Error(response?.msg || "Không thể tải avatar.");
      }
      setAvatarData(response?.data || null);
      notifySuccess(response?.msg || "Đã cập nhật avatar.");
    } catch (error) {
      console.error(error);
      notifyError(error.message || "Không thể tải avatar.");
    } finally {
      setIsAvatarBusy(false);
    }
  };

  const handleAvatarFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleAvatarUpload(file);
    }
    event.target.value = "";
  };

 const handleAvatarDelete = async () => {
  if (!userId || !avatarData) return;
  setIsAvatarBusy(true);
  try {
    const response = await UploadService.deleteUserAvatar(userId);
    if (response?.isError) {
      throw new Error(response?.msg || "Không thể xóa avatar.");
    }
    setAvatarData(null);
    notifySuccess(response?.msg || "Đã xóa avatar.");
  } catch (error) {
    console.error(error);
    notifyError(error.message || "Không thể xóa avatar.");
  } finally {
    setIsAvatarBusy(false);
  }
};


  const handleCvUpload = async (file) => {
    if (!userId || !validateCvFile(file)) return;
    const formData = new FormData();
    formData.append("cv", file);
    setIsCvBusy(true);
    try {
      const action = cvData ? UploadService.updateCandidateCv : UploadService.addCandidateCv;
      const response = await action(userId, formData);
      if (response?.isError) {
        throw new Error(response?.msg || "Không thể tải CV.");
      }
      setCvData(response?.data || null);
      notifySuccess(response?.msg || "Đã cập nhật CV.");
    } catch (error) {
      console.error(error);
      notifyError(error.message || "Không thể tải CV.");
    } finally {
      setIsCvBusy(false);
    }
  };

  const handleCvFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      handleCvUpload(file);
    }
    event.target.value = "";
  };

const handleCvDelete = async () => {
  if (!userId || !cvData) return;
  setIsCvBusy(true);
  try {
    const response = await UploadService.deleteCandidateCv(userId);
    if (response?.isError) {
      throw new Error(response?.msg || "Không thể xóa CV.");
    }
    setCvData(null);
    notifySuccess(response?.msg || "Đã xóa CV.");
  } catch (error) {
    console.error(error);
    notifyError(error.message || "Không thể xóa CV.");
  } finally {
    setIsCvBusy(false);
  }
};


  const parseFullName = (fullName) => {
    const trimmed = fullName.trim();
    if (!trimmed) return { firstName: candidateInfo.firstName, lastName: candidateInfo.lastName };
    const parts = trimmed.split(/\s+/);
    if (parts.length === 1) {
      return { firstName: parts[0], lastName: candidateInfo.lastName || parts[0] };
    }
    return {
      firstName: parts.slice(0, -1).join(" "),
      lastName: parts[parts.length - 1],
    };
  };

  const handleSubmit = async (values) => {
    if (!userId) {
      notifyError("Không xác định được người dùng.");
      return;
    }

    const namePayload = parseFullName(values.fullName || "");
    const trimmedWebsite = values.website?.trim() || "";
    const profilePayload = {
      experience: values.experience?.trim() || "",
      education: values.education?.trim() || "",
      bio: values.headline?.trim() || "",
      ...(trimmedWebsite
        ? {
            social: {
              linkedin: trimmedWebsite,
            },
          }
        : {}),
    };

    const shouldDeleteWebsite = !trimmedWebsite && Boolean(initialWebsite);

    setIsSaving(true);

    try {
      const updateInfoPromise = CandidateService.updateInfoCandidate(userId, namePayload);
      const profileAction = hasProfile
        ? CandidateService.updateCandidateProfile
        : CandidateService.addCandidateProfile;
      const profilePromise = profileAction(userId, profilePayload);
      const extraPromises = [];
      if (shouldDeleteWebsite && hasProfile) {
        extraPromises.push(CandidateService.deleteCandidateSocial(userId, "linkedin"));
      }

      const responses = await Promise.all([updateInfoPromise, profilePromise, ...extraPromises]);
      const infoResponse = responses[0];
      const profileResponse = responses[1];
      const deleteResponse = extraPromises.length ? responses[2] : null;

      if (infoResponse?.isError) {
        throw new Error(infoResponse?.msg || "Không thể cập nhật họ tên.");
      }
      if (profileResponse?.isError) {
        throw new Error(profileResponse?.msg || "Không thể cập nhật hồ sơ.");
      }
      if (deleteResponse?.isError) {
        throw new Error(deleteResponse?.msg || "Không thể cập nhật website.");
      }

      const updatedInfo = infoResponse?.data || {};
      setCandidateInfo({
        firstName: updatedInfo.firstName || namePayload.firstName,
        lastName: updatedInfo.lastName || namePayload.lastName,
      });
      setInitialWebsite(trimmedWebsite);
      setHasProfile(true);
      notifySuccess("Đã lưu thông tin cá nhân.");
    } catch (error) {
      console.error(error);
      notifyError(error.message || "Không thể lưu thông tin cá nhân.");
    } finally {
      setIsSaving(false);
    }
  };

  const cvMenuItems = [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Edit Resume",
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Delete",
      danger: true,
    },
  ];

  const handleCvMenuClick = ({ key }) => {
    if (key === "edit") {
      cvInputRef.current?.click();
    }
    if (key === "delete") {
      handleCvDelete();
    }
  };

  return (
    <div className="space-y-6">
      <SettingsHeader activeKey="personal" />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <section className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
            <header className="space-y-1">
              <Title level={4} className="!mb-0">
                Basic Information
              </Title>
            </header>

            <div className="grid gap-6 md:grid-cols-[260px,1fr] lg:grid-cols-[280px,1fr]">
              <div className="flex flex-col items-start gap-4">
                <Spin spinning={isAvatarBusy}>
                  {avatarData?.url ? (
                    <div className="flex flex-col items-start gap-4">
                      <Avatar
                        src={avatarData.url}
                        size={200}
                        shape="square"
                        className="!rounded-lg object-cover"
                      />
                      <div className="flex flex-wrap justify-start gap-2">
                        <Button icon={<EditOutlined />} onClick={() => avatarInputRef.current?.click()}>
                          Edit avatar 
                        </Button>
                        <Button danger icon={<DeleteOutlined />} onClick={handleAvatarDelete}>
                          Delete 
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Dragger
                      name="avatar"
                      multiple={false}
                      showUploadList={false}
                      accept="image/png,image/jpeg,image/webp"
                      disabled={isAvatarBusy}
                      beforeUpload={(file) => {
                        if (!validateAvatarFile(file)) return false;
                        handleAvatarUpload(file);
                        return false;
                      }}
                      className="w-full"
                      style={{ height: 220 }}
                    >
                      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                        <CloudUploadOutlined className="text-3xl text-primary-500" />
                        <Text strong>Browse photo or drop here</Text>
                        <Text type="secondary">A photo larger than 400 pixels works best. Max photo size 5 MB.</Text>
                      </div>
                    </Dragger>
                  )}
                </Spin>
                <input
                  type="file"
                  ref={avatarInputRef}
                  className="hidden"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarFileChange}
                />
                
              </div>

              <Form
                form={form}
                layout="vertical"
                initialValues={defaultFormValues}
                onFinish={handleSubmit}
                className="space-y-4"
              >

                <div className="grid gap-4 md:grid-cols-2">
                  <Form.Item name="experience" label="Experience">
                    <Select
                      size="large"
                      allowClear
                      placeholder="Select..."
                      options={mergedExperienceOptions}
                      showSearch
                      optionFilterProp="label"
                    />
                  </Form.Item>
                  <Form.Item name="education" label="Educations">
                    <Select
                      size="large"
                      allowClear
                      placeholder="Select..."
                      options={mergedEducationOptions}
                      showSearch
                      optionFilterProp="label"
                    />
                  </Form.Item>
                </div>

                <div className="flex justify-start">
                  <Button type="primary" htmlType="submit" size="large" loading={isSaving}>
                    Save Changes
                  </Button>
                </div>
              </Form>
            </div>
          </section>

          <section className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
            <header className="space-y-1">
              <Title level={4} className="!mb-0">
                Your CV/Resume
              </Title>
            </header>

            <div>
              <Spin spinning={isCvBusy}>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cvData ? (
                    <div className="relative flex flex-col justify-between rounded-lg border border-neutral-200 p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <FilePdfOutlined className="mt-1 text-2xl text-primary-500" />
                          <div className="space-y-1">
                            <Text strong>{cvData.fileName || "Resume.pdf"}</Text>
                            <Text type="secondary" className="block text-sm">
                              {formatFileSize(cvData.fileSize)}
                              {cvData.uploadedAt
                                ? ` • Uploaded ${dayjs(cvData.uploadedAt).format("MMM D, YYYY")}`
                                : ""}
                            </Text>
                          </div>
                        </div>
                        <Dropdown menu={{ items: cvMenuItems, onClick: handleCvMenuClick }} trigger={["click"]}>
                          <Button type="text" icon={<MoreOutlined />} />
                        </Dropdown>
                      </div>
                      <Button type="link" className="self-start px-0" href={cvData.url} target="_blank" rel="noopener noreferrer">
                        Download
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => cvInputRef.current?.click()}
                      className="flex h-full min-h-[160px] flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-neutral-200 bg-neutral-50 text-neutral-500 transition hover:border-primary-300 hover:text-primary-500"
                    >
                      <PlusOutlined className="text-xl" />
                      <span className="text-sm font-medium">Add CV/Resume</span>
                      <Text type="secondary" className="text-xs">Browse file or drop here. Only PDF</Text>
                    </button>
                  )}
                </div>
              </Spin>
            </div>
            <input
              type="file"
              ref={cvInputRef}
              className="hidden"
              accept="application/pdf"
              onChange={handleCvFileChange}
            />
          </section>
        </>
      )}
    </div>
  );
};

export default CandidatePersonal;
