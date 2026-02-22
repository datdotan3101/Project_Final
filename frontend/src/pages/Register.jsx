import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("STUDENT"); // STUDENT or LECTURER
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      // Gọi API Register từ Backend
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role, // Gửi Role đã chọn lên Backend
      });

      // Hiển thị Modal thông báo thay vì chuyển hướng ngay
      setModalType(role);
      setShowModal(true);
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
          Đăng Ký Tài Khoản
        </h2>

        {/* Hiển thị lỗi nếu đăng ký thất bại hoặc sai mật khẩu xác nhận */}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-md text-center text-sm mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Họ và tên
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập họ và tên của bạn"
              className="p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
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

          <div className="flex flex-col gap-1">
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

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              className="p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Vai trò đăng ký
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="p-3 border border-gray-300 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="STUDENT">Học viên</option>
              <option value="LECTURER">Giảng viên (Cần phê duyệt)</option>
            </select>
            {role === "LECTURER" && (
              <p className="text-[11px] text-orange-600 font-medium">
                * Tài khoản Giảng viên sẽ được Admin phê duyệt trong vòng 24h.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="mt-3 p-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition duration-200"
          >
            Đăng Ký
          </button>
        </form>

        {/* --- Link Redirect về Login --- */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-500 hover:underline transition duration-200"
          >
            Đăng nhập
          </Link>
        </p>
      </div>

      {/* --- MODAL THÔNG BÁO ĐĂNG KÝ THÀNH CÔNG --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-inner">
                {modalType === "LECTURER" ? "👨‍🏫" : "🎉"}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Đăng ký thành công!
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-8">
                {modalType === "LECTURER"
                  ? "Tài khoản Giảng viên của bạn đã được khởi tạo. Vui lòng chờ Admin phê duyệt trong vòng 24h trước khi đăng nhập nhé!"
                  : "Chào mừng bạn gia nhập cộng đồng học tập của chúng tôi. Bây giờ bạn có thể đăng nhập để bắt đầu trải nghiệm."}
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/30 transition-all duration-200"
              >
                Tiếp tục đến Đăng nhập
              </button>
            </div>
            <div className="bg-gray-50 py-3 text-center border-t border-gray-100">
              <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold">
                E-Learning System
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
