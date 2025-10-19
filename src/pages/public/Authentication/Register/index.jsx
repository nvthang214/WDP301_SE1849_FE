import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { notifySuccess } from "../../../../components/Notification";
import ROUTER from "../../../../router/ROUTER";
import { AuthService } from "../../../../services/AuthService";
import { ArrowRight } from "lucide-react";
import { LoadingOutlined } from "@ant-design/icons";

const Register = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await AuthService.register(formData);
      notifySuccess(response?.msg);
      setFormData({ firstName: "", lastName: "", email: "", username: "", password: "" });
      nav(ROUTER.LOGIN);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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
              className="font-semibold text-primary-600 hover:text-primary-500"
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
              className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
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
              className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
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
              className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
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
              className="w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
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
          <span>Create Account</span>
          {!loading ? null : <LoadingOutlined />}
        </button>
      </div>
    </form>
  );
};

export default Register;
