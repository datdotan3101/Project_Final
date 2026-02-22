import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CourseDetail from "./pages/CourseDetail";
import MyLearning from "./pages/MyLearning";
import Navbar from "./components/Navbar";
import Learn from "./pages/Learn";
import LecturerDashboard from "./pages/LecturerDashboard";
import CourseEditor from "./pages/CourseEditor";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/AdminDashboard";
import Courses from "./pages/Courses";
import Wishlist from "./pages/Wishlist";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["STUDENT", "LECTURER", "ADMIN"]}
                />
              }
            >
              <Route path="/learn/:id" element={<Learn />} />
            </Route>

            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["STUDENT", "LECTURER", "ADMIN"]}
                />
              }
            >
              <Route path="/learn/:id" element={<Learn />} />
            </Route>
            <Route path="/" element={<Home />} />
            {/* ================= PUBLIC ROUTES (Ai cũng vào được) ================= */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <h1 className="text-center mt-10 text-2xl font-bold">
                  Trang chủ (Khách & Học viên)
                </h1>
              }
            />

            {/* Thêm Route Chi Tiết Khóa Học */}
            <Route path="/course/:id" element={<CourseDetail />} />
            <Route path="/courses" element={<Courses />} />

            {/* ================= STUDENT ROUTES (Chỉ cần đăng nhập là vào được) ================= */}
            <Route
              element={
                <ProtectedRoute
                  allowedRoles={["STUDENT", "LECTURER", "ADMIN"]}
                />
              }
            >
              {/* 2. Sửa lại Route /my-learning để gọi đúng Component */}
              <Route path="/my-learning" element={<MyLearning />} />

              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />

              <Route
                path="/profile"
                element={
                  <h1 className="text-center mt-10 text-xl">Hồ sơ cá nhân</h1>
                }
              />
            </Route>

            {/* ================= LECTURER ROUTES (Chỉ Giảng viên & Admin vào được) ================= */}
            <Route
              element={<ProtectedRoute allowedRoles={["LECTURER", "ADMIN"]} />}
            >
              <Route
                path="/lecturer/dashboard"
                element={<LecturerDashboard />}
              />

              <Route path="/lecturer/course/new" element={<CourseEditor />} />
              <Route
                path="/lecturer/course/edit/:id"
                element={<CourseEditor />}
              />
              <Route
                path="/lecturer/create-course"
                element={
                  <h1 className="text-center mt-10 text-xl">
                    Trang tạo khóa học
                  </h1>
                }
              />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>

            {/* Route 404 cho các đường dẫn không tồn tại */}
            <Route
              path="*"
              element={
                <h1 className="text-center mt-10 text-2xl">
                  404 - Không tìm thấy trang
                </h1>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

// DÒNG NÀY CỰC KỲ QUAN TRỌNG ĐỂ FIX LỖI "does not provide an export named 'default'"
export default App;
