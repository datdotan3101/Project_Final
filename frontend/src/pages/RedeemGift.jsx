import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";

const RedeemGift = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [giftInfo, setGiftInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchGiftInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/gifts/info/${token}`);
        setGiftInfo(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Mã quà tặng không hợp lệ hoặc đã hết hạn.");
      } finally {
        setLoading(false);
      }
    };
    fetchGiftInfo();
  }, [token]);

  const handleRedeem = async () => {
    // Nếu chưa đăng nhập, chuyển tới trang đăng nhập rồi quay lại bằng tham số state
    if (!user) {
      navigate("/login", { state: { from: `/redeem/${token}` } });
      return;
    }

    setRedeeming(true);
    try {
      const authToken = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/gifts/redeem",
        { token },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      
      showToast("Tuyệt vời! Bạn đã nhận khóa học thành công.", "success");
      setTimeout(() => {
        navigate("/my-learning");
      }, 2500);

    } catch (err) {
      showToast(err.response?.data?.message || "Lỗi khi nhận khóa học.", "error");
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-4">
        <div className="bg-[#1c1d1f] border border-red-500/50 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl">error</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Không thể nhận quà</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition"
          >
            Trở về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-4 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="bg-[#1c1d1f] border border-slate-700 max-w-2xl w-full rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header Block */}
        <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 p-8 text-center relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 Mix-blend-overlay"></div>
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-xl rotate-3">
            <span className="material-symbols-outlined text-5xl text-pink-400">card_giftcard</span>
          </div>
          <h1 className="text-3xl font-black text-white relative z-10">Bạn nhận được một món quà!</h1>
          <p className="text-indigo-200 mt-2 relative z-10">Người tặng: <strong className="text-white">{giftInfo.sender_name}</strong></p>
        </div>

        {/* Content Block */}
        <div className="p-8">
          
          {/* Message Area */}
          <div className="bg-slate-800/50 border border-slate-700 p-6 rounded-xl mb-8 relative">
            <span className="material-symbols-outlined text-4xl text-slate-600 absolute -top-4 -left-2 rotate-180 bg-[#1c1d1f]">format_quote</span>
            <p className="text-slate-300 italic text-lg leading-relaxed text-center">
              "{giftInfo.message}"
            </p>
            <span className="material-symbols-outlined text-4xl text-slate-600 absolute -bottom-4 -right-2 bg-[#1c1d1f]">format_quote</span>
          </div>

          {/* Course Details */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-800 rounded-xl mb-8 shadow-inner border border-slate-700/50">
            <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-slate-700 border border-slate-600">
               {giftInfo.course?.thumbnail_url ? (
                  <img src={`http://localhost:5000${giftInfo.course.thumbnail_url}`} alt="Course" className="w-full h-full object-cover" />
               ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">No Image</div>
               )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">{giftInfo.course?.title}</h3>
              <p className="text-sm text-slate-400 line-clamp-2">{giftInfo.course?.description}</p>
            </div>
          </div>

          {/* Action Area */}
          <div className="text-center">
            {user ? (
              <p className="text-sm text-slate-400 mb-4">
                Bạn đang đăng nhập với tài khoản <strong className="text-white">{user.email}</strong>
              </p>
            ) : (
              <p className="text-sm text-amber-400 mb-4 bg-amber-900/20 p-2 rounded-lg inline-block border border-amber-500/30">
                Bạn cần đăng nhập hoặc tạo tài khoản để nhận khóa học này.
              </p>
            )}

            <button
              onClick={handleRedeem}
              disabled={redeeming}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl transition disabled:opacity-50 shadow-lg shadow-indigo-600/30 text-lg flex items-center justify-center gap-2 mx-auto"
            >
              {redeeming ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span className="material-symbols-outlined">redeem</span>
                  {user ? "Nhận Khóa Học Ngay" : "Đăng nhập để nhận quà"}
                </>
              )}
            </button>             
          </div>

        </div>
      </div>
      
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default RedeemGift;
