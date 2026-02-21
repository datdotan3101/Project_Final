import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CourseDetail from "./pages/CourseDetail";
import Checkout from "./pages/CheckOut";
import MyLearning from "./pages/MyLearning";
import Learning from "./pages/Learning";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import InstructorDashboard from "./pages/InstructorDashboard";
import CourseEditor from "./pages/CourseEditor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />

        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-learning" element={<MyLearning />} />

        <Route path="/learn/:id" element={<Learning />} />

        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />

        <Route path="/instructor/course/create" element={<CourseEditor />} />
        <Route path="/instructor/course/edit/:id" element={<CourseEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

// DÒNG NÀY CỰC KỲ QUAN TRỌNG ĐỂ FIX LỖI "does not provide an export named 'default'"
export default App;
