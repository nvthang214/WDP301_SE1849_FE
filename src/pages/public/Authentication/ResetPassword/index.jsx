import { LoadingOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifyError, notifySuccess } from "../../../../components/Notification";
import { AuthService } from "../../../../services/AuthService";
import ROUTER from "../../../../router/ROUTER";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";

const resetPasswordSchema = z
  .object({
    oldPassword: z.string().min(6, "Mật khẩu cũ phải có ít nhất 6 ký tự."),
    newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự."),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "Mật khẩu mới phải khác mật khẩu cũ.",
    path: ["newPassword"],
  });

const ResetPasswordScreen = () => {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const handleLogin = handleSubmit(async (formValues) => {
    try {
      const res = await AuthService.resetPassword({ newPassword: formValues.newPassword }, token);
      notifySuccess(res?.msg);
      reset();
      nav(ROUTER.LOGIN);
    } catch (error) {
      const message = error?.response?.data?.msg || "Không thể đặt lại mật khẩu.";
      notifyError(message);
    }
  });

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
              {...register("oldPassword")}
              placeholder="Enter your old password"
              className="focus:border-primary-500 focus:ring-primary-100 w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:ring-2 focus:outline-none"
              autoComplete="old-password"
              aria-invalid={errors.oldPassword ? "true" : "false"}
            />
            {errors.oldPassword ? (
              <p className="mt-1 text-xs text-red-500">{errors.oldPassword.message}</p>
            ) : null}
          </div>
          <div className="text-left">
            <input
              id="email"
              name="newPassword"
              type="password"
              {...register("newPassword")}
              placeholder="Enter your new password"
              className="focus:border-primary-500 focus:ring-primary-100 w-full rounded-md border border-neutral-200 px-4 py-2.5 text-neutral-800 transition focus:ring-2 focus:outline-none"
              autoComplete="new-password"
              aria-invalid={errors.newPassword ? "true" : "false"}
            />
            {errors.newPassword ? (
              <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>
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
      </div>
    </form>
  );
};

export default ResetPasswordScreen;
