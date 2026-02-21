import React, { createContext, useState, useEffect, useContext } from "react";

// 1. Khởi tạo Context
const AuthContext = createContext();

// 2. Tạo Custom Hook để các component khác dùng cho ngắn gọn
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Component Provider để bọc toàn bộ ứng dụng
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Trạng thái loading giúp ứng dụng không bị chớp màn hình khi đang đọc Local Storage
  const [loading, setLoading] = useState(true);

  // Chạy 1 lần duy nhất khi ứng dụng vừa bật lên
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Hàm xử lý lưu thông tin khi đăng nhập thành công
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  // Hàm xử lý xóa thông tin khi đăng xuất
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* Chỉ render các component con khi đã kiểm tra xong trạng thái đăng nhập */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
