import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

const GiftCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    recipientEmail: "",
    senderName: user?.name || "",
    message: "Một món quà khóa học dành cho bạn!",
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        showToast("Không thể tải thông tin khóa học.", "error");
        setTimeout(() => navigate("/"), 2000);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckoutAndGift = async (e) => {
    e.preventDefault();
    if (!formData.recipientEmail) {
      return showToast("Vui lòng nhập Email người nhận", "error");
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      
      console.log("Bat dau kiem tra email...");
      // 1. Kiểm tra Email có thật không (DNS MX lookup trên Backend)
      const verifyRes = await axios.post(
        "http://localhost:5000/api/gifts/verify-email",
        { email: formData.recipientEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Ket qua verify:", verifyRes.data);

      if (verifyRes.data && verifyRes.data.valid) {
        // 2. CHỈ KHI HỢP LỆ mới chuyển hướng
        console.log("Email hop le, dang chuyen huong sang Checkout...");
        navigate(`/checkout/${courseId}`, {
          state: {
            giftData: {
              recipientEmail: formData.recipientEmail,
              senderName: formData.senderName,
              message: formData.message,
            }
          }
        });
      } else {
        throw new Error(verifyRes.data?.message || "Email không hợp lệ.");
      }
    } catch (error) {
      console.error("Loi xac thuc email:", error);
      const errorMsg = error.response?.data?.message || error.message || "Email không tồn tại hoặc không thể nhận thư.";
      showToast(errorMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* LEFT: Gift Form */}
        <div className="flex-1 bg-[#1c1d1f] border border-slate-700 rounded-xl p-8 shadow-2xl">
          <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
            <span className="material-symbols-outlined text-pink-500 text-3xl">featured_seasonal_and_gifts</span>
            Tặng khóa học này
          </h2>
          
          <form onSubmit={handleCheckoutAndGift} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Tên của bạn (Người tặng)</label>
              <input
                type="text"
                name="senderName"
                value={formData.senderName}
                onChange={handleChange}
                placeholder="Nhập tên của bạn"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Email người nhận *</label>
              <input
                type="email"
                name="recipientEmail"
                value={formData.recipientEmail}
                onChange={handleChange}
                required
                placeholder="nam@example.com"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Lời nhắn gửi kèm</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                placeholder="Nhập lời chúc hoặc thông điệp gửi đến người nhận..."
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Thanh toán & Gửi quà"
              )}
            </button>
            <p className="text-xs text-slate-500 text-center mt-4">
              Người nhận sẽ nhận được một Email kèm mã kích hoạt khóa học này.
            </p>
          </form>
        </div>

        {/* RIGHT: Order Summary */}
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="bg-[#1c1d1f] border border-slate-700 rounded-xl overflow-hidden shadow-2xl sticky top-24">
            <div className="relative aspect-video">
              {course.thumbnail_url ? (
                <img src={`http://localhost:5000${course.thumbnail_url}`} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center">No Image</div>
              )}
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-bold text-white leading-tight mb-2 line-clamp-2">{course.title}</h3>
              <p className="text-sm text-slate-400 mb-4">{course.lecturer?.name || "Giảng viên"}</p>
              
              <div className="flex justify-between items-center mb-6 py-4 border-y border-slate-700">
                <span className="text-slate-300 font-bold">Tổng thanh toán:</span>
                <span className="text-2xl font-black text-white">₫{course.price?.toLocaleString("vi-VN")}</span>
              </div>
              
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex gap-2 items-center"><span className="material-symbols-outlined text-[16px] text-green-400">check_circle</span> Quyền truy cập trọn đời</li>
                <li className="flex gap-2 items-center"><span className="material-symbols-outlined text-[16px] text-green-400">check_circle</span> Chứng chỉ hoàn thành</li>
                <li className="flex gap-2 items-center"><span className="material-symbols-outlined text-[16px] text-green-400">check_circle</span> Được học trên mọi thiết bị</li>
              </ul>
            </div>
          </div>
        </div>

      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default GiftCourse;
