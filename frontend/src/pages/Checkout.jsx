import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { clearCart, removeFromCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Danh sách IDs có thể từ URL param (1 course) hoặc từ state (nhiều courses)
  const [courseIds, setCourseIds] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    let ids = [];
    if (id === "multiple" && location.state?.selectedCourseIds) {
      ids = location.state.selectedCourseIds;
    } else if (id && id !== "multiple") {
      ids = [parseInt(id)];
    }

    if (ids.length === 0) {
      navigate("/cart");
      return;
    }

    setCourseIds(ids);

    const fetchCourses = async () => {
      try {
        const coursePromises = ids.map((courseId) =>
          axios.get(`http://localhost:5000/api/courses/${courseId}`),
        );
        const responses = await Promise.all(coursePromises);
        setCourses(responses.map((res) => res.data));
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Có lỗi xảy ra khi tải thông tin khóa học!");
        navigate("/");
      }
    };
    fetchCourses();
  }, [id, location.state, navigate]);

  const handleCheckout = async () => {
    if (!user) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      navigate("/login");
      return;
    }

    setProcessing(true);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/checkout",
        { courseIds: courseIds },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Xóa các khóa học đã mua khỏi giỏ hàng
      courseIds.forEach((courseId) => removeFromCart(courseId));

      setTimeout(() => {
        setProcessing(false);
        alert(
          "🎉 Thanh toán thành công! Khóa học đã được thêm vào tài khoản của bạn.",
        );
        navigate("/my-learning");
      }, 2000);
    } catch (err) {
      setProcessing(false);
      alert(err.response?.data?.message || "Có lỗi xảy ra khi thanh toán.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const originalTotal = courses.reduce((acc, c) => acc + (c.price || 0), 0);
  const discounts = 0;
  const tax = 0;
  const total = originalTotal - discounts + tax;

  return (
    <div className="bg-[#0b1120] min-h-screen text-slate-300 font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* LEFT COLUMN: Review & Items */}
          <div className="flex-1 space-y-8">
            <div>
              <h1 className="text-4xl font-black text-white mb-2">Checkout</h1>
              <p className="text-slate-400">
                Review your {courses.length} items and complete payment.
              </p>
            </div>

            {/* Courses List */}
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-[#1c2431] border border-slate-700/50 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 hover:border-blue-500/30 transition group overflow-hidden relative shadow-2xl"
                >
                  <div className="w-full sm:w-40 aspect-video overflow-hidden rounded-xl shrink-0">
                    <img
                      src={
                        course.thumbnail_url
                          ? `http://localhost:5000${course.thumbnail_url}`
                          : "https://via.placeholder.com/300x168"
                      }
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition line-clamp-2">
                          {course.title}
                        </h2>
                        <span className="text-lg font-black text-blue-400 ml-4 shrink-0">
                          ₫{course.price?.toLocaleString("vi-VN")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">
                        By {course.lecturer?.name || "Anonymous Expert"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: "lock", text: "SECURE PAYMENT" },
                { icon: "verified_user", text: "DATA PROTECTION" },
                { icon: "support_agent", text: "24/7 SUPPORT" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center gap-3 bg-[#111827] border border-slate-800 p-4 rounded-xl text-slate-400 font-black text-[10px] tracking-widest uppercase"
                >
                  <span className="material-symbols-outlined text-xl text-blue-500">
                    {item.icon}
                  </span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Payment Sidebar */}
          <div className="w-full lg:w-[450px] flex-shrink-0">
            <div className="bg-[#1c2431] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden sticky top-8">
              <div className="p-8">
                <h2 className="text-2xl font-black text-white mb-8">
                  Payment Details
                </h2>

                {/* Tabs */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-[#111827] rounded-xl mb-8">
                  {[
                    { id: "card", label: "Card", icon: "credit_card" },
                    { id: "paypal", label: "PayPal", icon: "payments" },
                    {
                      id: "transfer",
                      label: "Transfer",
                      icon: "account_balance",
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setPaymentMethod(tab.id)}
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg transition-all duration-300 ${paymentMethod === tab.id ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                    >
                      <span className="material-symbols-outlined text-xl">
                        {tab.icon}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        {tab.label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Form Inputs (Card specific) */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      Cardholder Name
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                        person
                      </span>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-[#111827] border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium placeholder:text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                        credit_card
                      </span>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        className="w-full bg-[#111827] border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium placeholder:text-slate-700 tracking-widest"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full bg-[#111827] border border-slate-800 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium placeholder:text-slate-700 text-center"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full bg-[#111827] border border-slate-800 rounded-xl py-4 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-medium placeholder:text-slate-700 text-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="h-px bg-slate-800 my-8"></div>

                {/* Price Breakdown */}
                <div className="mt-8 space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-500">
                      Original Price ({courses.length} items)
                    </span>
                    <span className="text-white font-bold">
                      ₫{originalTotal?.toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-slate-500">Discounts</span>
                    <span className="text-red-400 font-bold">
                      - ₫{discounts?.toLocaleString("vi-VN")}
                    </span>
                  </div>

                  <div className="h-px bg-slate-800 my-4"></div>

                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-2xl font-black text-white">
                        Total
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                        VAT Included
                      </div>
                    </div>
                    <div className="text-3xl font-black text-white tracking-tight">
                      ₫{total?.toLocaleString("vi-VN")}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={processing}
                  className="w-full mt-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl transition-all duration-300 shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
                >
                  {processing ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <>
                      Complete Payment{" "}
                      <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
