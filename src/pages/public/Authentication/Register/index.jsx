import { LoadingOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Divider } from "antd";
import LoginGoogle from "../../../../components/Authentication/LoginGoogle";
import useAuthStore from "../../../../store/useAuthStore";
import { notifyError, notifySuccess } from "../../../../components/Notification";
import ROUTER from "../../../../router/ROUTER";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const registerSchema = z.object({
  firstName: z.string().min(1, "Vui lòng nhập tên."),
  lastName: z.string().min(1, "Vui lòng nhập họ."),
  email: z.string().min(1, "Vui lòng nhập email.").email("Email không hợp lệ."),
  username: z.string().min(4, "Tên đăng nhập phải có ít nhất 4 ký tự."),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự."),
});

const Register = () => {
  const { register: registerAccount, loading } = useAuthStore();
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (formValues) => {
    const res = await registerAccount(formValues);
    if (res?.isOk) {
      notifySuccess(res?.msg || "Đăng ký thành công! Vui lòng đăng nhập.");
      reset();
      nav(ROUTER.LOGIN);
      return;
    }

    notifyError(res?.msg || "Đăng ký thất bại, vui lòng thử lại!");
  });

  return (
    <form onSubmit={onSubmit} className="flex h-full flex-col gap-8">
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
              {...register("firstName")}
              placeholder="Nguyễn"
              className="focus:border-primary-500 focus:ring-primary-100 w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:ring-2 focus:outline-none"
              autoComplete="given-name"
              aria-invalid={errors.firstName ? "true" : "false"}
            />
            {errors.firstName ? (
              <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
            ) : null}
          </div>

          <div className="text-left">
            <label htmlFor="lastName" className="mb-2 block text-sm font-semibold text-neutral-600">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              {...register("lastName")}
              placeholder="Văn A"
              className="focus:border-primary-500 focus:ring-primary-100 w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:ring-2 focus:outline-none"
              autoComplete="family-name"
              aria-invalid={errors.lastName ? "true" : "false"}
            />
            {errors.lastName ? (
              <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
            ) : null}
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
              {...register("username")}
              placeholder="Enter your username"
              className="focus:border-primary-500 focus:ring-primary-100 w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:ring-2 focus:outline-none"
              autoComplete="username"
              aria-invalid={errors.username ? "true" : "false"}
            />
            {errors.username ? (
              <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
            ) : null}
          </div>

          <div className="text-left">
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-neutral-600">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              {...register("password")}
              placeholder="Enter your password"
              className="focus:border-primary-500 focus:ring-primary-100 w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:ring-2 focus:outline-none"
              autoComplete="new-password"
              aria-invalid={errors.password ? "true" : "false"}
            />
            {errors.password ? (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            ) : null}
          </div>

          <div className="text-left">
            <label htmlFor="email" className="mb-2 block text-sm font-semibold text-neutral-600">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              {...register("email")}
              placeholder="example@gmail.com"
              className="focus:border-primary-500 focus:ring-primary-100 w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:ring-2 focus:outline-none"
              autoComplete="email"
              aria-invalid={errors.email ? "true" : "false"}
            />
            {errors.email ? (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            ) : null}
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
