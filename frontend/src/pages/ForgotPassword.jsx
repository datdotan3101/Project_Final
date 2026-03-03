import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Bước 1: Gửi yêu cầu OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      setMessage(response.data.message);
      setStep(2); // Chuyển sang tab nhập OTP ngay lập tức
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Bước 2: Xác thực OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
      });
      setMessage(response.data.message);
      setStep(3); // Chuyển sang tab mật khẩu mới
    } catch (err) {
      setError(err.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  // Bước 3: Đặt lại mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      return setError("Mật khẩu xác nhận không khớp!");
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { email, otp, password }
      );
      setMessage("Mật khẩu đã được thay đổi thành công! Đang chuyển hướng về trang đăng nhập...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1120] px-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= s ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-400"}`}>
                  {s}
                </div>
              </div>
              {s < 3 && <div className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${step > s ? "bg-blue-600" : "bg-gray-100"}`} />}
            </React.Fragment>
          ))}
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {step === 1 && "Quên mật khẩu?"}
          {step === 2 && "Xác thực OTP"}
          {step === 3 && "Mật khẩu mới"}
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          {step === 1 && "Nhập email của bạn để nhận mã xác thực."}
          {step === 2 && `Mã đã được gửi tới: ${email}`}
          {step === 3 && "Thiết lập mật khẩu mới cho tài khoản của bạn."}
        </p>

        {message && (
          <div className="bg-green-50 text-green-600 p-3 rounded-lg text-center text-sm mb-5 border border-green-100">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-center text-sm mb-5 border border-red-100">
            {error}
          </div>
        )}

        {/* STEP 1: FORM EMAIL */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`mt-2 p-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition duration-200 ${loading ? "opacity-70" : ""}`}
            >
              {loading ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </form>
        )}

        {/* STEP 2: FORM OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Mã OTP (6 số)</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="******"
                maxLength={6}
                className="p-4 border-2 border-dashed border-blue-200 rounded-xl text-2xl text-center font-bold tracking-[10px] focus:border-blue-500 outline-none bg-blue-50/30"
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 p-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition duration-200"
            >
              {loading ? "Đang xác thực..." : "Xác thực mã OTP"}
            </button>
            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="text-sm text-gray-500 hover:text-blue-600 transition"
            >
              Chỉnh sửa email
            </button>
          </form>
        )}

        {/* STEP 3: FORM NEW PASSWORD */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Mật khẩu mới</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu ít nhất 6 ký tự"
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700">Xác nhận mật khẩu</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu"
                className="p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-2 p-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition duration-200 shadow-lg"
            >
              {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-gray-600">
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition duration-200 flex items-center justify-center gap-1"
          >
             Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
