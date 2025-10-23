import { zodResolver } from "@hookform/resolvers/zod";
import { Divider } from "antd";
import { notifyError, notifySuccess } from "../../../../components/Notification";
import ROUTER from "../../../../router/ROUTER";
import { AuthService } from "../../../../services/AuthService";
import { LoadingOutlined } from "@ant-design/icons";
import LoginGoogle from "../../../../components/Authentication/LoginGoogle";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email.").email("Email không hợp lệ."),
});

const ForgotPasswordScreen = () => {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleLogin = handleSubmit(async (formValues) => {
    try {
      const res = await AuthService.forgotPassword({ email: formValues.email });
      notifySuccess(res?.msg);
      reset();
      nav(ROUTER.LOGIN);
    } catch (error) {
      const message = error?.response?.data?.msg || "Không thể gửi email đặt lại mật khẩu.";
      notifyError(message);
    }
  });

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
              {...register("email")}
              placeholder="Enter your email address"
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
          disabled={isSubmitting}
          className="bg-primary-600 hover:bg-primary-700 focus-visible:outline-primary-600 flex w-full items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-semibold !text-white shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:bg-neutral-300"
        >
          <span>Reset Password</span>
          {!isSubmitting ? null : <LoadingOutlined />}
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
