import { LoadingOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import { ArrowRight, Chrome } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../../../../components/Notification";
import ROUTER from "../../../../router/ROUTER";
import { AuthService } from "../../../../services/AuthService";

const LoginScreen = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const res = await AuthService.login({
        username: formData.username,
        password: formData.password,
      });
      notifySuccess(res?.msg || "Đăng nhập thành công!");
      nav(ROUTER.HOME);
    } catch (error) {
      notifyError(error.response?.data?.msg || "Đăng nhập thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex h-full flex-col justify-between gap-8">
      <div className="space-y-6">
        <header className="space-y-4">
          <div className="text-3xl font-bold text-neutral-900">Sign in</div>
          <p className="text-sm text-neutral-500">
            Don&apos;t have account?{" "}
            <Link
              to={ROUTER.REGISTER}
              className="font-semibold text-primary hover:text-primary-500"
            >
              Create Account
            </Link>
          </p>
        </header>

        <div className="space-y-4">
          <div className="text-left">
            <input
              id="email"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              autoComplete="username"
              required
            />
          </div>

          <div className="text-left">
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-3 text-sm text-neutral-600">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={formData.remember}
              onChange={handleChange}
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <span>Remember me</span>
          </label>
          <Link
            to={ROUTER.FORGOT_PASSWORD}
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Forgot password
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-3 text-sm font-semibold !text-white shadow-sm transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          <span>Sign In</span>
          {!loading ? <ArrowRight className="h-4 w-4" /> : <LoadingOutlined />}
        </button>

        <Divider>or</Divider>

        <div className="w-full">
          <button
            type="button"
            className="flex items-center justify-center gap-3 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 w-full mb-3"
          >
            <Chrome className="h-4 w-4" />
            <span>Sign in with Google</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginScreen;
