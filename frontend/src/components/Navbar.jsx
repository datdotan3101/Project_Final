import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Đăng xuất xong thì đẩy về trang Đăng nhập
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Tên hệ thống */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              UdemyClone
            </Link>
          </div>

          {/* Menu bên phải */}
          <div className="flex items-center gap-4">
            {/* NẾU CHƯA ĐĂNG NHẬP (KHÁCH) */}
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 font-medium transition duration-150"
                >
                  Đăng Nhập
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition duration-150"
                >
                  Đăng Ký
                </Link>
              </>
            ) : (
              /* NẾU ĐÃ ĐĂNG NHẬP */
              <>
                <span className="text-gray-700 font-medium hidden sm:block">
                  Chào, <span className="text-blue-600">{user.name}</span>
                </span>

                {/* Nút điều hướng theo Role */}
                {user.role === "ADMIN" && (
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-600 hover:text-blue-600 font-medium"
                  >
                    Trang Quản Trị
                  </Link>
                )}

                {user.role === "LECTURER" && (
                  <Link
                    to="/lecturer/dashboard"
                    className="text-gray-600 hover:text-blue-600 font-medium"
                  >
                    Trang Giảng Viên
                  </Link>
                )}

                {user.role === "STUDENT" && (
                  <Link
                    to="/my-learning"
                    className="text-gray-600 hover:text-blue-600 font-medium"
                  >
                    Khóa Học Của Tôi
                  </Link>
                )}

                {/* Nút Đăng xuất */}
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-md font-medium hover:bg-red-100 transition duration-150 ml-2"
                >
                  Đăng Xuất
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
