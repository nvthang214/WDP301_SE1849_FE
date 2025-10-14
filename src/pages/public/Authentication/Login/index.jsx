import React, { useState } from "react";
import { notifySuccess, notifyError } from "../../../../components/Notification";
import { AuthService } from "../../../../services/AuthService";

const LoginScreen = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await AuthService.login(formData);
      notifySuccess("Đăng nhập thành công!");
      // 👉 Optional: điều hướng sang dashboard
      // navigate("/dashboard");
    } catch (error) {
      console.error(error);
      notifyError(error.response?.data?.message || "Đăng nhập thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="flex flex-col bg-white p-8 shadow-lg rounded-xl w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Đăng nhập hệ thống
        </h2>

        <label htmlFor="username" className="mb-1 text-gray-600">
          Tên đăng nhập
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập tên đăng nhập"
          required
        />

        <label htmlFor="password" className="mt-4 mb-1 text-gray-600">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nhập mật khẩu"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition disabled:bg-gray-400"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;
