import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  // 1. Khởi tạo role mặc định là STUDENT
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (selectedRole) => {
    setFormData((prev) => ({ ...prev, role: selectedRole }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setIsLoading(true);

    try {
      // GỌI API ĐĂNG KÝ
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role, // Sẽ gửi 'STUDENT' hoặc 'LECTURER'
        },
      );

      if (response.status === 201) {
        alert(
          formData.role === "LECTURER"
            ? "Đăng ký Giảng viên thành công! Vui lòng đăng nhập để vào Dashboard."
            : "Đăng ký Học viên thành công! Vui lòng đăng nhập.",
        );
        navigate("/login");
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
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#1e293b] py-8 px-4 shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-xl sm:px-10 border border-slate-200 dark:border-slate-800">
          {error && (
            <div className="mb-6 p-3 bg-rose-50 dark:bg-rose-500/10 border-l-4 border-rose-500 text-rose-600 dark:text-rose-400 text-sm font-medium rounded-r">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleRegister}>
            {/* COMPONENT CHỌN ROLE */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                I want to be a...
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleRoleChange("STUDENT")}
                  className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border rounded-xl font-bold transition-all ${
                    formData.role === "STUDENT"
                      ? "border-[#135bec] bg-[#135bec]/10 text-[#135bec]"
                      : "border-slate-300 dark:border-slate-600 text-slate-500 hover:bg-slate-50 dark:hover:bg-[#151e2e]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    school
                  </span>
                  Student
                </button>
                {/* Sửa value thành LECTURER */}
                <button
                  type="button"
                  onClick={() => handleRoleChange("LECTURER")}
                  className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border rounded-xl font-bold transition-all ${
                    formData.role === "LECTURER"
                      ? "border-[#135bec] bg-[#135bec]/10 text-[#135bec]"
                      : "border-slate-300 dark:border-slate-600 text-slate-500 hover:bg-slate-50 dark:hover:bg-[#151e2e]"
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    cast_for_education
                  </span>
                  Lecturer
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] sm:text-sm bg-slate-50 dark:bg-[#101622] text-slate-900 dark:text-white transition-colors"
                />
              </div>
            </div>

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

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#135bec] focus:border-[#135bec] sm:text-sm bg-slate-50 dark:bg-[#101622] text-slate-900 dark:text-white transition-colors"
                />
              </div>
            </div>

            <div className="pt-2">
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
                  `Sign up as ${formData.role === "LECTURER" ? "Lecturer" : "Student"}`
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-[#135bec] hover:text-blue-500 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
