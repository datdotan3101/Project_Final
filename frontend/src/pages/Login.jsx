import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom"; // Import thêm Link từ react-router-dom
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const { token, user } = response.data;
      login(user, token);

      if (location.state?.from) {
        navigate(location.state.from);
      } else if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (user.role === "LECTURER") {
        navigate("/lecturer/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/google-login", {
        token: credentialResponse.credential,
      });

      const { token, user } = response.data;
      login(user, token);

      if (location.state?.from) {
        navigate(location.state.from);
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập Google thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Lỗi khi đăng nhập bằng Google!");
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
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700">
                Mật khẩu
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-blue-600 hover:text-blue-500 hover:underline transition duration-200"
              >
                Quên mật khẩu?
              </Link>
            </div>
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
            disabled={loading}
            className="mt-2 p-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-400"
          >
            {loading ? "Đang xử lý..." : "Đăng Nhập"}
          </button>
        </form>

        <div className="mt-4 flex flex-col items-center">
          <div className="relative w-full mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 font-medium whitespace-nowrap">hoặc đăng nhập bằng</span>
            </div>
          </div>
          
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            theme="filled_blue"
            text="signin_with"
            shape="rectangular"
            width="100%"
          />
        </div>

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
