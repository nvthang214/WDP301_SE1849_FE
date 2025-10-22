import { Divider } from "antd";
import { ArrowRight, Chrome } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notifySuccess } from "../../../../components/Notification";
import ROUTER from "../../../../router/ROUTER";
import { AuthService } from "../../../../services/AuthService";
import { LoadingOutlined } from "@ant-design/icons";
import LoginGoogle from "../../../../components/Authentication/LoginGoogle";

const ForgotPasswordScreen = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
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
      const res = await AuthService.forgotPassword({ email: formData.email });
      notifySuccess(res?.msg);
      nav(ROUTER.LOGIN);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex h-full flex-col justify-between gap-8">
      <div className="space-y-6">
        <header className="space-y-4">
          <div className="text-3xl font-bold text-neutral-900">Forgot Password</div>
          <p className="text-sm text-neutral-500">
            Go back to{" "}
            <Link
              to={ROUTER.LOGIN}
              className="text-primary-600 hover:text-primary-500 font-semibold"
            >
              Sign in
            </Link>
          </p>
          <p className="text-sm text-neutral-500">
            Don&apos;t have account?{" "}
            <Link
              to={ROUTER.REGISTER}
              className="text-primary-600 hover:text-primary-500 font-semibold"
            >
              Create Account
            </Link>
          </p>
        </header>

        <div className="space-y-4">
          <div className="text-left">
            <input
              id="email"
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
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
          <span>Reset Password</span>
          {!loading ? null : <LoadingOutlined />}
        </button>

        <Divider>or</Divider>

        <div className="w-full">
          <LoginGoogle />
        </div>
      </div>
    </form>
  );
};

export default ForgotPasswordScreen;
