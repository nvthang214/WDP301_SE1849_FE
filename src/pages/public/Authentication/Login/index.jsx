import { LoadingOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import { ArrowRight, Chrome } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notifyError, notifySuccess } from "../../../../components/Notification";
import ROUTER from "../../../../router/ROUTER";
import { AuthService } from "../../../../services/AuthService";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import LoginGoogle from "../../../../components/Authentication/LoginGoogle";
import useAuthStore from "../../../../store/useAuthStore";

const LoginScreen = () => {
  const { login, loading } = useAuthStore();
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const res = await login({
      username: formData.username,
      password: formData.password,
    });
    if (res?.isOk) {
      notifySuccess(res?.msg || "Đăng nhập thành công!");
      nav(ROUTER.HOME);
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
              className="text-primary hover:text-primary-500 font-semibold"
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
              className="focus:border-primary-500 focus:ring-primary-100 w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:ring-2 focus:outline-none"
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
              className="focus:border-primary-500 focus:ring-primary-100 w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:ring-2 focus:outline-none"
              autoComplete="current-password"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <Link
            to={ROUTER.FORGOT_PASSWORD}
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            Forgot password
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary-600 hover:bg-primary-700 focus-visible:outline-primary-600 flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold !text-white shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          <span>Sign In</span>
          {!loading ? <ArrowRight className="h-4 w-4" /> : <LoadingOutlined />}
        </button>

        <Divider>or</Divider>

        <div className="w-full">
          <LoginGoogle />
        </div>
      </div>
    </form>
  );
};

export default LoginScreen;
