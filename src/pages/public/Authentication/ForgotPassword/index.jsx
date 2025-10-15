import { Divider } from "antd";
import { ArrowRight, Chrome } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notifySuccess } from "../../../../components/Notification";
import ROUTER from "../../../../router/ROUTER";
import { AuthService } from "../../../../services/AuthService";
import { LoadingOutlined } from "@ant-design/icons";

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
              className="font-semibold text-primary-600 hover:text-primary-500"
            >
              Sign in
            </Link>
          </p>
          <p className="text-sm text-neutral-500">
            Don&apos;t have account?{" "}
            <Link
              to={ROUTER.REGISTER}
              className="font-semibold text-primary-600 hover:text-primary-500"
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
              className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              autoComplete="email"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-3 text-sm font-semibold !text-white shadow-sm transition hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          <span>Reset Password</span>
          {!loading ? null : <LoadingOutlined />}
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

export default ForgotPasswordScreen;
