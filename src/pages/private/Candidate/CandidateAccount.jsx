import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Input, Spin, Typography } from "antd";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import SettingsHeader from "./components/Header";
import { CandidateService } from "../../../services/CandidateService";
import { AuthService } from "../../../services/AuthService";
import { notifyError, notifySuccess } from "../../../components/Notification";
import useAuthStore from "../../../store/useAuthStore";

const { Title } = Typography;

const DEFAULT_STATE = { firstName: "", lastName: "", email: "", phoneNumber: "",};

const CandidateAccount = () => {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [initialValues, setInitialValues] = useState({ ...DEFAULT_STATE });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);

  // lấy user từ authstore
  const { user,loading } = useAuthStore();
  const userId = useMemo(() => user?._id || user?.id || user?.userId || null, [user]);

  const nameValidator = (_, value) => {
    if (!value) return Promise.resolve();
    if (/\d/.test(value)) {
      return Promise.reject(new Error("Tên không được chứa số."));
    }
    return Promise.resolve();
  };

  useEffect(() => {
    if (loading) return;

    if (!userId) {
      notifyError("Không tìm thấy thông tin người dùng, vui lòng đăng nhập lại.");
      setIsLoading(false);
      return;
    }

    const fetchCandidateInfo = async () => {
      setIsLoading(true);
      try {
        const response = await CandidateService.getInfoCandidate(userId);
        if (response?.isError) {
          throw new Error(response?.msg || "Không thể tải thông tin tài khoản.");
        }

        const data = response?.data || {};
        const prepared = {
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
        };

        setInitialValues(prepared);
        form.setFieldsValue(prepared);
      } catch (error) {
        console.error(error);
        notifyError(error.message || "Không thể tải thông tin tài khoản.");
        setInitialValues({ ...DEFAULT_STATE });
        form.setFieldsValue({ ...DEFAULT_STATE });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidateInfo();
  }, [loading, form, userId]);

  const handleSubmit = async (values) => {
    if (!userId) {
      notifyError("Không xác định được người dùng.");
      return;
    }

    const payload = {
      firstName: values.firstName?.trim() || "",
      lastName: values.lastName?.trim() || "",
      phoneNumber: values.phoneNumber?.trim() ?? "",
    };

    setIsSubmitting(true);

    try {
      const response = await CandidateService.updateInfoCandidate(userId, payload);
      if (response?.isError) {
        throw new Error(response?.msg || "Không thể cập nhật thông tin tài khoản.");
      }

      const updatedValues = {
        firstName: response?.data?.firstName ?? payload.firstName,
        lastName: response?.data?.lastName ?? payload.lastName,
        email: response?.data?.email ?? values.email ?? initialValues.email,
        phoneNumber: response?.data?.phoneNumber ?? payload.phoneNumber,
      };

      setInitialValues(updatedValues);
      form.setFieldsValue(updatedValues);
      notifySuccess(response?.msg || "Đã cập nhật thông tin tài khoản.");
    } catch (error) {
      console.error(error);
      notifyError(error.message || "Không thể cập nhật thông tin tài khoản.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (values) => {
    setIsPasswordSubmitting(true);
    try {
      const payload = {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      };

      const response = await AuthService.changePassword(payload);
      if (response?.isError) {
        throw new Error(response?.msg || "Không thể đổi mật khẩu.");
      }

      notifySuccess(response?.msg || "Đã đổi mật khẩu thành công.");
      passwordForm.resetFields();
    } catch (error) {
      console.error(error);
      notifyError(error.message || "Không thể đổi mật khẩu.");
    } finally {
      setIsPasswordSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <SettingsHeader activeKey="account" />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Form
            form={form}
            layout="vertical"
            initialValues={initialValues}
            onFinish={handleSubmit}
            requiredMark={false}
            className="space-y-6"
          >
            <section className="space-y-5 rounded-lg bg-white">
              <header className="space-y-1">
                <Title level={4} className="!mb-0">
                  Contact Info
                </Title>
              </header>

              <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
                <Form.Item
                  label="First name"
                  name="firstName"
                  rules={[
                    { required: true, message: "Vui lòng nhập first name." },
                    {
                      validator: nameValidator,
                    },
                  ]}
                  style={{ marginBottom: 12 }}
                >
                  <Input size="large" placeholder="First name" autoComplete="given-name" />
                </Form.Item>

                <Form.Item
                  label="Last name"
                  name="lastName"
                  rules={[
                    { required: true, message: "Vui lòng nhập last name." },
                    {
                      validator: nameValidator,
                    },
                  ]}
                  style={{ marginBottom: 12 }}
                >
                  <Input size="large" placeholder="Last name" autoComplete="family-name" />
                </Form.Item>
              </div>

              <div className="grid gap-y-3">
                <Form.Item
                  label="Phone"
                  name="phoneNumber"
                  rules={[
                    { required: true, message: "Vui lòng nhập số điện thoại." },
                    {
                      pattern: /^[0-9+()\-\s]{10}$/,
                      message: "Số điện thoại không hợp lệ.",
                    },
                  ]}
                  style={{ marginBottom: 12 }}
                >
                  <Input
                    size="large"
                    placeholder="(+84) 0123 456 789"
                    prefix={<PhoneOutlined className="text-primary-500" />}
                    autoComplete="tel"
                  />
                </Form.Item>

                <Form.Item label="Email" name="email">
                  <Input
                    size="large"
                    disabled
                    prefix={<MailOutlined className="text-primary-500" />}
                    autoComplete="email"
                  />
                </Form.Item>
              </div>

              <div className="flex justify-start">
                <Button type="primary" htmlType="submit" size="large" loading={isSubmitting}>
                  Save Changes
                </Button>
              </div>
            </section>
          </Form>
          <div className="mt-10 border-t border-neutral-200"></div>
          <section className="mt-8 space-y-5 rounded-lg bg-white">
            <header className="space-y-1">
              <Title level={4} className="!mb-0">
                Change Password
              </Title>
            </header>

            <Form
              form={passwordForm}
              layout="vertical"
              requiredMark={false}
              onFinish={handlePasswordSubmit}
              className="space-y-6"
            >
              <div className="grid gap-4 md:grid-cols-3">
                <Form.Item
                  label="Current Password"
                  name="oldPassword"
                  rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại." }]}
                >
                  <Input.Password
                    size="large"
                    placeholder="Password"
                    autoComplete="current-password"
                  />
                </Form.Item>

                <Form.Item
                  label="New Password"
                  name="newPassword"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu mới." },
                    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự." },
                  ]}
                >
                  <Input.Password size="large" placeholder="Password" autoComplete="new-password" />
                </Form.Item>

                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  dependencies={["newPassword"]}
                  rules={[
                    { required: true, message: "Vui lòng xác nhận mật khẩu." },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error("Mật khẩu xác nhận không khớp."));
                      },
                    }),
                  ]}
                >
                  <Input.Password size="large" placeholder="Password" autoComplete="new-password" />
                </Form.Item>
              </div>

              <div className="flex justify-start">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={isPasswordSubmitting}
                >
                  Save Changes
                </Button>
              </div>
            </Form>
          </section>
        </>
      )}
    </div>
  );
};

export default CandidateAccount;
