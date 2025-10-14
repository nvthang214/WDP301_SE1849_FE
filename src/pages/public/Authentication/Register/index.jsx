import { useState } from "react";
import { notifySuccess } from "../../../../components/Notification";
import { AuthService } from "../../../../services/AuthService";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await AuthService.register(formData);
      notifySuccess(res?.msg);
      setFormData({
        username: "",
        email: "",
        password: "",
        firstName: "",
        lastName: "",
      });
      setLoading(false);
      window.location.href = "/login";
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Đăng ký tài khoản</h2>

        <div className="grid grid-cols-2 gap-3">
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Họ"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Tên"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Tên đăng nhập"
          className="mt-3 border rounded-lg w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          className="mt-3 border rounded-lg w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mật khẩu"
          type="password"
          className="mt-3 border rounded-lg w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-5 bg-blue-600 text-white py-2 w-full rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>
    </div>
  );
};

export default Register;
