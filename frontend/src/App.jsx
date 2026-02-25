import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
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
import BecomeLecturer from "./pages/BecomeLecturer";
import Footer from "./components/Footer";
import Notifications from "./pages/Notifications";
import DashboardNotifications from "./pages/DashboardNotifications";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import { ChatProvider } from "./context/ChatContext";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ChatProvider>
            <Navbar />
            <div className="min-h-screen bg-[#0b1120]">
              <Routes>
                {/* Tất cả routes giữ nguyên */}
                <Route
                  element={
                    <ProtectedRoute allowedRoles={["STUDENT", "LECTURER"]} />
                  }
                >
                  <Route path="/profile" element={<Profile />} />
                </Route>

                <Route
                  element={
                    <ProtectedRoute
                      allowedRoles={["STUDENT", "LECTURER", "ADMIN"]}
                    />
                  }
                >
                  <Route path="/learn/:id" element={<Learn />} />
                  <Route path="/my-learning" element={<MyLearning />} />
                  <Route path="/checkout/:id" element={<Checkout />} />
                  <Route path="/become-lecturer" element={<BecomeLecturer />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/cart" element={<Cart />} />
                </Route>

                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/course/:id" element={<CourseDetail />} />
                <Route path="/courses" element={<Courses />} />

                <Route
                  element={
                    <ProtectedRoute allowedRoles={["LECTURER", "ADMIN"]} />
                  }
                >
                  <Route
                    path="/lecturer/dashboard"
                    element={<LecturerDashboard />}
                  />
                  <Route
                    path="/lecturer/notifications"
                    element={<DashboardNotifications />}
                  />
                  <Route
                    path="/lecturer/course/new"
                    element={<CourseEditor />}
                  />
                  <Route
                    path="/lecturer/course/edit/:id"
                    element={<CourseEditor />}
                  />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route
                    path="/admin/notifications"
                    element={<DashboardNotifications />}
                  />
                </Route>

                <Route
                  path="*"
                  element={
                    <h1 className="text-center mt-10 text-2xl">
                      404 - Not Found
                    </h1>
                  }
                />
              </Routes>
            </div>
            <Footer />
            <Chatbot />
          </ChatProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
