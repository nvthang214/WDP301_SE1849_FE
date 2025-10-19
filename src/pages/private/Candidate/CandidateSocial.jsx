import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, Select, Space, Spin, Typography } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  PlusCircleOutlined,
  CloseOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import { notifyError, notifySuccess } from "../../../components/Notification";
import { CandidateService } from "../../../services/CandidateService";
import SettingsHeader from "./components/Header";

const { Title, Text } = Typography;
const { Option } = Select;

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#0a66c2" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const SOCIAL_PLATFORMS = [
  {
    value: "facebook",
    label: "Facebook",
    icon: <FacebookOutlined style={{ color: "#1877f2" }} />,
  },
  {
    value: "twitter",
    label: "Twitter",
    icon: <TwitterOutlined style={{ color: "#1da1f2" }} />,
  },
  {
    value: "instagram",
    label: "Instagram",
    icon: <InstagramOutlined style={{ color: "#d6249f" }} />,
  },
  {
    value: "linkedin",
    label: "LinkedIn",
    icon: <LinkedInIcon />,
  },
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
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode access token", error);
    return null;
  }
};

const createEmptyLink = (platform = "") => ({
  id:
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`,
  platform,
  url: "",
  persisted: false,
});

const getNextAvailablePlatform = (links) => {
  const used = new Set(links.map((item) => item.platform).filter(Boolean));
  const candidate = SOCIAL_PLATFORMS.find((option) => !used.has(option.value));
  return candidate?.value || "";
};

const toSocialArray = (data) => {
  if (Array.isArray(data)) {
    return data.map((item, index) => ({
      id: `${item.platform || "empty"}-${index}-${Math.random()}`,
      platform: item.platform || "",
      url: item.url || "",
      persisted: Boolean(item.platform && item.url),
    }));
  }

  if (data && typeof data === "object") {
    return Object.entries(data).map(([platform, url], index) => ({
      id: `${platform}-${index}-${Math.random()}`,
      platform,
      url: url || "",
      persisted: Boolean(platform && url),
    }));
  }

  return [];
};

const CandidateSocial = () => {
  const [userId, setUserId] = useState(null);
  const [socialLinks, setSocialLinks] = useState([createEmptyLink()]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const nextAvailablePlatform = useMemo(() => getNextAvailablePlatform(socialLinks), [socialLinks]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const payload = decodeAccessToken(token);
    if (!payload?.userId) {
      notifyError("Không tìm thấy thông tin người dùng, vui lòng đăng nhập lại.");
      setIsLoading(false);
      return;
    }
    setUserId(payload.userId);
    const fetchSocial = async () => {
      try {
        const response = await CandidateService.getCandidateSocial(payload.userId);
        if (response?.isError) {
          if (response.statusCode !== 404) {
            notifyError(response?.msg || "Không thể tải dữ liệu mạng xã hội.");
          }
          setSocialLinks([createEmptyLink()]);
          return;
        }

  const normalized = toSocialArray(response?.data);
  setSocialLinks(normalized.length ? normalized : [createEmptyLink(getNextAvailablePlatform([]))]);
      } catch (error) {
        console.error(error);
        notifyError("Không thể tải dữ liệu mạng xã hội.");
  setSocialLinks([createEmptyLink(getNextAvailablePlatform([]))]);
      } finally {
        setIsLoading(false);
        setIsDirty(false);
      }
    };

    fetchSocial();
  }, []);

  const handlePlatformChange = (id, platform) => {
    setSocialLinks((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              platform,
              persisted: false,
            }
          : item
      )
    );
    setIsDirty(true);
  };

  const handleUrlChange = (id, url) => {
    setSocialLinks((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              url,
              persisted: false,
            }
          : item
      )
    );
    setIsDirty(true);
  };

  const handleAddSocialLink = () => {
  setSocialLinks((prev) => [...prev, createEmptyLink(nextAvailablePlatform)]);
    setIsDirty(true);
  };

  const handleRemoveSocialLink = (id) => {
    setSocialLinks((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      if (updated.length) return updated;
      const fallback = getNextAvailablePlatform(updated);
      return [createEmptyLink(fallback)];
    });
    setIsDirty(true);
  };

  const handleSaveChanges = async () => {
    if (!userId) {
      notifyError("Không xác định được người dùng.");
      return;
    }

    const prepared = socialLinks
      .map((item) => ({
        platform: item.platform,
        url: item.url.trim(),
      }))
      .filter((item) => item.platform && item.url);

    const hasDuplicatePlatform = prepared.some(
      (link, index) => prepared.findIndex((item) => item.platform === link.platform) !== index
    );

    if (hasDuplicatePlatform) {
      notifyError("Mỗi mạng xã hội chỉ được chọn một lần.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await CandidateService.addCandidateSocial(userId, prepared);
      if (response?.isError) {
        throw new Error(response?.msg || "Không thể lưu thông tin mạng xã hội.");
      }

      const normalized = toSocialArray(response?.data);
      setSocialLinks(() => {
        if (!normalized.length) {
          const fallback = getNextAvailablePlatform([]);
          return [createEmptyLink(fallback)];
        }
        return normalized;
      });
      setIsDirty(false);
      notifySuccess(response?.msg || "Đã cập nhật mạng xã hội thành công.");
    } catch (error) {
      console.error(error);
      notifyError(error.message || "Không thể lưu thông tin mạng xã hội.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSocialSelectOptions = () =>
    SOCIAL_PLATFORMS.map((option) => (
      <Option key={option.value} value={option.value} label={option.label}>
        <div className="flex items-center gap-2">
          {option.icon}
          <span>{option.label}</span>
        </div>
      </Option>
    ));

  return (
    <div >
      <SettingsHeader activeKey="social"/>
      <div >
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {socialLinks.map((link, index) => (
              <div key={link.id} className="flex flex-col gap-2">
                <Text strong className="text-neutral-700">Social Link {index + 1}</Text>
                <Space.Compact style={{ width: "100%" }} size="large">
                  <Select
                    value={link.platform || undefined}
                    placeholder="Select platform"
                    style={{ width: 160 }}
                    onChange={(value) => handlePlatformChange(link.id, value)}
                    optionLabelProp="label"
                    disabled={isSubmitting}
                  >
                    {renderSocialSelectOptions()}
                  </Select>
                  <Input
                    value={link.url}
                    onChange={(event) => handleUrlChange(link.id, event.target.value)}
                    placeholder="Profile link/url..."
                    prefix={<LinkOutlined className="text-neutral-400" />}
                    disabled={isSubmitting}
                  />
                  <Button
                    icon={<CloseOutlined />}
                    danger
                    onClick={() => handleRemoveSocialLink(link.id)}
                    disabled={isSubmitting && link.persisted}
                    style={{ background: "#fef2f2", borderColor: "#fecaca" }}
                  />
                </Space.Compact>
              </div>
            ))}

            <Button
              type="dashed"
              icon={<PlusCircleOutlined />}
              onClick={handleAddSocialLink}
              disabled={isSubmitting}
              style={{ width: "100%", height: 48 }}
            >
              Add New Social Link
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          type="primary"
          size="large"
          onClick={handleSaveChanges}
          loading={isSubmitting}
          disabled={isLoading || !userId || (!isDirty && socialLinks.every((item) => !item.platform && !item.url))}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default CandidateSocial;
