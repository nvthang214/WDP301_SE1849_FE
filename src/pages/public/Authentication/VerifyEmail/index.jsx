import { Button, Result, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ROUTER from "../../../../router/ROUTER";
import { AuthService } from "../../../../services/AuthService";

const initialState = {
  loading: true,
  status: "info",
  title: "Đang xác thực email...",
  message: "Vui lòng chờ trong giây lát.",
};

const VerifyEmailScreen = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [state, setState] = useState(() => ({ ...initialState }));

  useEffect(() => {
    let isUnmounted = false;

    if (!token) {
      setState({
        loading: false,
        status: "error",
        title: "Liên kết không hợp lệ",
        message: "Token xác thực không hợp lệ hoặc đã bị thiếu.",
      });
      return undefined;
    }

    const verify = async () => {
      setState({ ...initialState });
      try {
        const res = await AuthService.verifyEmail(token, { skipNotify: true });
        if (isUnmounted) return;

        const msg = res?.msg || "Xác thực email thành công.";
        const alreadyVerified = msg.toLowerCase().includes("đã được xác thực");

        setState({
          loading: false,
          status: alreadyVerified ? "info" : "success",
          title: alreadyVerified ? "Email đã xác thực" : "Xác thực thành công",
          message: msg,
        });
      } catch (error) {
        if (isUnmounted) return;
        const msg =
          error?.response?.data?.msg || "Không thể xác thực email. Vui lòng yêu cầu liên kết mới.";
        setState({
          loading: false,
          status: "error",
          title: "Xác thực thất bại",
          message: msg,
        });
      }
    };

    verify();

    return () => {
      isUnmounted = true;
    };
  }, [token]);

  if (state.loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <Spin size="large" />
        <span className="text-sm text-neutral-500">Đang xác thực email...</span>
      </div>
    );
  }

  return (
    <Result
      status={state.status}
      title={state.title}
      subTitle={state.message}
      extra={[
        <Button key="login" type="primary" onClick={() => navigate(ROUTER.LOGIN)}>
          Đi đến đăng nhập
        </Button>,
        <Button key="home" onClick={() => navigate(ROUTER.HOME)}>
          Về trang chủ
        </Button>,
      ]}
    />
  );
};

export default VerifyEmailScreen;
