import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../../../../components/Notification";
import ROUTER from "../../../../router/ROUTER";
import { AuthService } from "../../../../services/AuthService";
import { ArrowRight } from "lucide-react";
import { LoadingOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import LoginGoogle from "../../../../components/Authentication/LoginGoogle";
import useAuthStore from "../../../../store/useAuthStore";

const Register = () => {
  const { register, loading } = useAuthStore();
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await register(formData);
    if (res?.isOk) {
      notifySuccess(res?.msg || "Đăng ký thành công! Vui lòng đăng nhập.");
      nav(ROUTER.LOGIN);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col gap-8">
      <div className="space-y-6">
        <header className="space-y-4">
          <div className="text-3xl font-semibold text-neutral-900">Create Account</div>
          <p className="text-sm text-neutral-500">
            Already have account?{" "}
            <Link
              to={ROUTER.LOGIN}
              className="text-primary-600 hover:text-primary-500 font-semibold"
            >
              Sign in
            </Link>
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="text-left">
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-semibold text-neutral-600"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Nguyễn"
              className="focus:border-primary-500 focus:ring-primary-100 w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:ring-2 focus:outline-none"
              autoComplete="given-name"
              required
            />
          </div>

          <div className="text-left">
            <label htmlFor="lastName" className="mb-2 block text-sm font-semibold text-neutral-600">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Văn A"
              className="focus:border-primary-500 focus:ring-primary-100 w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:ring-2 focus:outline-none"
              autoComplete="family-name"
              required
            />
          </div>
        </div>

        <div className="grid gap-4">
          <div className="text-left">
            <label htmlFor="username" className="mb-2 block text-sm font-semibold text-neutral-600">
              Username
            </label>
            <input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="focus:border-primary-500 focus:ring-primary-100 w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:ring-2 focus:outline-none"
              autoComplete="username"
              required
            />
          </div>

          <div className="text-left">
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-neutral-600">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="focus:border-primary-500 focus:ring-primary-100 w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:ring-2 focus:outline-none"
              autoComplete="new-password"
              required
            />
          </div>

          <div className="text-left">
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-neutral-600">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="focus:border-primary-500 focus:ring-primary-100 w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:ring-2 focus:outline-none"
              autoComplete="email"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary-600 hover:bg-primary-700 focus-visible:outline-primary-600 flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold !text-white shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          <span>Create Account</span>
          {!loading ? null : <LoadingOutlined />}
        </button>
        <Divider size="small">or</Divider>

        <div className="w-full">
          <LoginGoogle />
        </div>
      </div>
    </form>
  );
};

export default Register;
