import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // Import thêm Link từ react-router-dom
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth(); // 2. Lấy hàm login từ Context

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        },
      );

      const { token, user } = response.data;

      // 3. Sử dụng hàm login từ Context thay vì ghi trực tiếp vào localStorage
      login(user, token);

      alert("Đăng nhập thành công!");

      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (user.role === "LECTURER") {
        navigate("/lecturer/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message);
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại!");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 md:p-10 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Đăng Nhập Hệ Thống
        </h2>

        {/* Hiển thị lỗi nếu đăng nhập thất bại */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-center text-sm mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email của bạn"
              className="p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="mt-2 p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition duration-200"
          >
            Đăng Nhập
          </button>
        </form>

        {/* --- Link Redirect to Register --- */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition duration-200"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
