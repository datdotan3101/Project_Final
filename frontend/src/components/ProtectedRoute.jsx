import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  // 1. Nếu chưa đăng nhập -> Đuổi về trang Login
  if (!user) {
    // replace: ghi đè lịch sử duyệt web để người dùng không back lại trang bảo mật được
    return <Navigate to="/login" replace />;
  }

  // 2. Nếu đã đăng nhập, nhưng Role không nằm trong danh sách cho phép -> Đuổi về Trang chủ
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    alert("Bạn không có quyền truy cập vào trang này!");
    return <Navigate to="/" replace />;
  }

  // 3. Nếu qua hết các vòng kiểm tra trên -> Cho phép render các component con bên trong
  return <Outlet />;
};

export default ProtectedRoute;
