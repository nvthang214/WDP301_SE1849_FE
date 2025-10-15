import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { notifySuccess } from "../../../../components/Notification";
import { AuthService } from "../../../../services/AuthService";
import { LoadingOutlined } from "@ant-design/icons";
import ROUTER from "../../../../router/ROUTER";

const ResetPasswordScreen = () => {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
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
      const res = await AuthService.resetPassword({ newPassword: formData.newPassword }, token);
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
          <div className="text-3xl font-bold text-neutral-900">Reset Password</div>
        </header>

        <div className="space-y-4">
          <div className="text-left">
            <input
              id="email"
              name="oldPassword"
              type="password"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Enter your old password"
              className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              autoComplete="old-password"
              required
            />
          </div>
          <div className="text-left">
            <input
              id="email"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter your new password"
              className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
              autoComplete="new-password"
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
      </div>
    </form>
  );
};

export default ResetPasswordScreen;
