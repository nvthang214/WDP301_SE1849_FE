import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { notifyError, notifySuccess } from "../../Notification";
import { AuthService } from "../../../services/AuthService";
import { useNavigate } from "react-router-dom";
import ROUTER from "../../../router/ROUTER";

const LoginGoogle = () => {
  const nav = useNavigate();
  const handleSuccess = async (credentialResponse) => {
    try {
      const credential = credentialResponse?.credential;
      if (!credential) throw new Error("Không nhận được token từ Google");

      const res = await AuthService.loginWithGoogle({ token: credential });
      notifySuccess(res?.msg || "Đăng nhập bằng Google thành công!");
      nav(ROUTER.HOME);
    } catch (err) {
      console.error("Google login error:", err);
      notifyError("Đăng nhập bằng Google thất bại, vui lòng thử lại!");
    }
  };
  const handleError = () => {
    notifyError("Đăng nhập bằng Google thất bại, vui lòng thử lại!");
  };
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </GoogleOAuthProvider>
  );
};

export default LoginGoogle;
