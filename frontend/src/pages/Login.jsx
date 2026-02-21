import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  // 1. State quản lý Form, Lỗi và Trạng thái loading
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 2. Hàm xử lý khi gõ vào input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Hàm gọi API Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
      );

      // IN RA CONSOLE ĐỂ KIỂM TRA DỮ LIỆU THỰC TẾ BACKEND TRẢ VỀ
      console.log("=== THÔNG TIN TỪ BACKEND ===");
      console.log(response.data);

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Dùng optional chaining (?.) và thêm trim() để cắt bỏ khoảng trắng thừa
      const userRole = user?.role?.toString().toUpperCase().trim() || "STUDENT";

      console.log("=== ROLE ĐÃ ĐƯỢC CHUẨN HÓA ===", userRole);

      // KIỂM TRA ĐIỀU HƯỚNG
      if (
        userRole === "LECTURER" ||
        userRole === "INSTRUCTOR" ||
        userRole === "ADMIN"
      ) {
        console.log("Đang chuyển hướng sang Dashboard Giảng viên...");
        navigate("/instructor/dashboard");
      } else {
        console.log("Đang chuyển hướng sang Trang chủ Sinh viên...");
        navigate("/");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Không thể kết nối đến server. Vui lòng thử lại!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans text-slate-900 dark:text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 text-[#135bec] mb-6"
        >
          <div className="size-10 flex items-center justify-center rounded bg-[#135bec] text-white">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <h2 className="text-2xl font-bold">EduMarket</h2>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#1e293b] py-8 px-4 shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-xl sm:px-10 border border-slate-200 dark:border-slate-800">
          {/* HIỂN THỊ LỖI NẾU CÓ */}
          {error && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-500/10 border-l-4 border-rose-500 text-rose-600 dark:text-rose-400 text-sm font-medium rounded-r">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] sm:text-sm bg-slate-50 dark:bg-[#101622] text-slate-900 dark:text-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] sm:text-sm bg-slate-50 dark:bg-[#101622] text-slate-900 dark:text-white transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#135bec] focus:ring-[#135bec] border-slate-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-slate-900 dark:text-slate-300"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-[#135bec] hover:text-blue-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-[#135bec] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#135bec] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="material-symbols-outlined animate-spin">
                    progress_activity
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-[#1e293b] text-slate-500">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/register"
                handleLogin="w-full flex justify-center py-3 px-4 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm text-sm font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Create new account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
