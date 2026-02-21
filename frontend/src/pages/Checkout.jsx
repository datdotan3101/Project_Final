import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Checkout = () => {
  const { id } = useParams(); // Nhận ID khóa học từ URL
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("vnpay"); // Mặc định chọn VNPay

  // Lấy thông tin khóa học để hiển thị hóa đơn
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/courses/${id}`,
        );
        setCourse(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Không tìm thấy thông tin khóa học!");
        navigate("/");
      }
    };
    fetchCourse();
  }, [id, navigate]);

  // Hàm xử lý thanh toán thực sự
  const handleCheckout = async () => {
    if (!user) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      navigate("/login");
      return;
    }

    setProcessing(true);

    try {
      const token = localStorage.getItem("token");

      // Gửi mảng chứa ID khóa học lên API checkout mà chúng ta đã viết ở Backend
      await axios.post(
        "http://localhost:5000/api/checkout",
        { courseIds: [parseInt(id)] },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Giả lập độ trễ của cổng thanh toán (2 giây) cho cảm giác chân thực
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Thanh toán an toàn
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* CỘT TRÁI: Phương thức thanh toán */}
          <div className="flex-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Chọn phương thức thanh toán
              </h2>

              <div className="space-y-4">
                {/* Lựa chọn 1: VNPay */}
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${paymentMethod === "vnpay" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="vnpay"
                    checked={paymentMethod === "vnpay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div className="ml-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-bold text-xs">
                      VNPAY
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">
                        Cổng thanh toán VNPay
                      </p>
                      <p className="text-sm text-gray-500">
                        Thanh toán qua thẻ ATM nội địa / QR Code
                      </p>
                    </div>
                  </div>
                </label>

                {/* Lựa chọn 2: MoMo */}
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${paymentMethod === "momo" ? "border-pink-500 bg-pink-50" : "border-gray-200 hover:bg-gray-50"}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="momo"
                    checked={paymentMethod === "momo"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-pink-600"
                  />
                  <div className="ml-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded flex items-center justify-center font-bold text-xs">
                      MoMo
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Ví điện tử MoMo</p>
                      <p className="text-sm text-gray-500">
                        Quét mã QR qua ứng dụng MoMo
                      </p>
                    </div>
                  </div>
                </label>

                {/* Lựa chọn 3: Thẻ quốc tế */}
                <label
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${paymentMethod === "card" ? "border-gray-800 bg-gray-100" : "border-gray-200 hover:bg-gray-50"}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-gray-900"
                  />
                  <div className="ml-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 text-gray-700 rounded flex items-center justify-center">
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
                        <path
                          fillRule="evenodd"
                          d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">
                        Thẻ Tín dụng / Ghi nợ
                      </p>
                      <p className="text-sm text-gray-500">
                        Visa, Mastercard, JCB
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: Tóm tắt đơn hàng (Order Summary) */}
          <div className="w-full md:w-96 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-4">
                Tóm tắt đơn hàng
              </h2>

              {/* Thông tin khóa học */}
              <div className="flex gap-4 mb-6">
                <img
                  src={
                    course.thumbnail_url
                      ? `http://localhost:5000${course.thumbnail_url}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={course.title}
                  className="w-20 h-14 object-cover rounded shadow-sm"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 line-clamp-2 text-sm">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {course.lecturer?.name}
                  </p>
                </div>
              </div>

              {/* Tính toán giá */}
              <div className="space-y-3 text-sm text-gray-600 border-b pb-4 mb-4">
                <div className="flex justify-between">
                  <span>Giá gốc:</span>
                  <span>
                    {course.price === 0
                      ? "0 đ"
                      : `${course.price.toLocaleString("vi-VN")} đ`}
                  </span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá:</span>
                  <span>- 0 đ</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-lg text-gray-800">
                  Tổng cộng:
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  {course.price === 0
                    ? "Miễn phí"
                    : `${course.price.toLocaleString("vi-VN")} đ`}
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-4 text-center">
                Bằng việc hoàn tất giao dịch, bạn đồng ý với Điều khoản dịch vụ
                của chúng tôi.
              </p>

              {/* Nút bấm thanh toán có hiệu ứng Loading */}
              <button
                onClick={handleCheckout}
                disabled={processing}
                className={`w-full py-4 text-white font-bold rounded-lg transition text-lg flex justify-center items-center ${processing ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl"}`}
              >
                {processing ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận thanh toán"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
