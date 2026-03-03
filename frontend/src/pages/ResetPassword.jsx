import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Lấy email từ state (do ForgotPassword truyền sang)
    const [email, setEmail] = useState(location.state?.email || "");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // Bước 1: Nhập OTP, Bước 2: Nhập mật khẩu

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
            setStep(2); // Chuyển sang bước nhập mật khẩu
        } catch (err) {
            setError(err.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn.");
        } finally {
            setLoading(false);
        }
    };

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
                `http://localhost:5000/api/auth/reset-password`,
                { email, otp, password }
            );
            setMessage(response.data.message);
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b1120] px-4">
            <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
                {/* Thanh trạng thái bước */}
                <div className="flex items-center justify-between mb-8 px-4">
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>1</div>
                        <span className="text-[10px] mt-1 font-semibold text-gray-400">NHẬP OTP</span>
                    </div>
                    <div className={`flex-1 h-1 mx-2 rounded ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"}`}>2</div>
                        <span className="text-[10px] mt-1 font-semibold text-gray-400">MẬT KHẨU MỚI</span>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    {step === 1 ? "Xác thực mã OTP" : "Tạo mật khẩu mới"}
                </h2>
                <p className="text-center text-gray-500 mb-6 text-sm">
                    {step === 1 ? "Mã 6 số đã được gửi tới email của bạn." : "Vui lòng nhập mật khẩu mới bảo mật hơn."}
                </p>

                {message && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-md text-center text-sm mb-5 border border-green-200">
                        {message} {step === 2 && step !== 3 ? "" : ""}
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-md text-center text-sm mb-5 border border-red-200">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="p-3 border border-gray-300 rounded-lg text-base bg-gray-50"
                                readOnly
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Mã OTP (6 số)</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="******"
                                maxLength={6}
                                className="p-4 border-2 border-dashed border-blue-200 rounded-lg text-2xl text-center font-bold tracking-[10px] focus:border-blue-500 focus:outline-none bg-blue-50/30"
                                required
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`mt-2 p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg ${loading ? "opacity-70" : ""}`}
                        >
                            {loading ? "Đang xác thực..." : "Xác thực OTP"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">Mật khẩu mới</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập ít nhất 6 ký tự"
                                className="p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500"
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
                                placeholder="Xác nhận lại mật khẩu"
                                className="p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`mt-2 p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg ${loading ? "opacity-70" : ""}`}
                        >
                            {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                        </button>
                    </form>
                )}

                <p className="mt-8 text-center text-sm text-gray-600">
                    <Link
                        to="/forgot-password"
                        className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition duration-200"
                    >
                        {step === 1 ? "Gửi lại mã OTP" : "Quay lại bước 1"}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
