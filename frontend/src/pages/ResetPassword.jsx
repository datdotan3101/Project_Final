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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!email) {
            return setError("Thiếu thông tin email. Vui lòng quay lại trang quên mật khẩu.");
        }

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
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError("Có lỗi xảy ra, vui lòng thử lại!");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0b1120] px-4">
            <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-full max-w-md border border-gray-100">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
                    Xác thực & Đặt lại
                </h2>
                <p className="text-center text-gray-500 mb-6 text-sm">
                    Nhập mã OTP vừa được gửi tới email của bạn.
                </p>

                {message && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-md text-center text-sm mb-5 border border-green-200">
                        {message} Đang chuyển hướng về trang đăng nhập...
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-md text-center text-sm mb-5 border border-red-200">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập email của bạn"
                            className="p-3 border border-gray-300 rounded-lg text-base bg-gray-50"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Mã OTP (6 số)</label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Nhập mã 6 số"
                            maxLength={6}
                            className="p-3 border border-gray-300 rounded-lg text-base text-center font-bold tracking-widest focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Mật khẩu mới</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu mới"
                            className="p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Xác nhận mật khẩu mới"
                            className="p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`mt-2 p-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition duration-200 shadow-lg ${loading ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-600">
                    <Link
                        to="/forgot-password"
                        className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition duration-200"
                    >
                        Gửi lại mã OTP
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;
