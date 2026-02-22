import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL"); // ALL, PENDING, APPROVED, REJECTED
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotiDropdown, setShowNotiDropdown] = useState(false);
  const [moderationData, setModerationData] = useState({
    courseId: null,
    status: "",
    comment: "",
  });
  const navigate = useNavigate();

  // Gọi API lấy danh sách toàn bộ khóa học
  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/courses/admin/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setCourses(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Không thể tải danh sách khóa học. Vui lòng kiểm tra quyền Admin!");
      setLoading(false);
    }
  };

  // Gọi API lấy thông báo
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/notifications",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setNotifications(response.data);
    } catch (err) {
      console.error("Lỗi lấy thông báo:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchNotifications();
    // Tự động reload thông báo mỗi 30s
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markNotificationAsRead = async (notiId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/notifications/${notiId}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Mở modal để nhập comment trước khi duyệt/từ chối
  const openModerationModal = (courseId, status) => {
    setModerationData({ courseId, status, comment: "" });
    setShowModal(true);
  };

  const handleConfirmModeration = async () => {
    const { courseId, status, comment } = moderationData;
    if (!comment.trim()) return alert("Vui lòng nhập lý do hoặc nhận xét!");

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/courses/${courseId}`,
        { status: status, admin_comment: comment },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      alert(`Đã chuyển trạng thái khóa học thành ${status}!`);
      setShowModal(false);
      fetchCourses();
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra khi cập nhật trạng thái!");
      setLoading(false);
    }
  };

  // Tính toán số liệu thống kê
  const totalCourses = courses.length;
  const pendingCourses = courses.filter((c) => c.status === "PENDING").length;
  const approvedCourses = courses.filter((c) => c.status === "APPROVED").length;

  // Lọc danh sách hiển thị
  const displayedCourses =
    filter === "ALL" ? courses : courses.filter((c) => c.status === filter);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* --- HEADER --- */}
      <div className="bg-red-800 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              🛡️
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-red-200 text-sm mt-1">
                Trung tâm kiểm duyệt và quản lý hệ thống
              </p>
            </div>
          </div>

          {/* --- THÔNG BÁO --- */}
          <div className="relative">
            <button
              onClick={() => setShowNotiDropdown(!showNotiDropdown)}
              className="relative p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-900 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-red-800">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotiDropdown && (
              <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden text-gray-900 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-sm">Thông báo mới</h3>
                  <span className="text-xs text-blue-600 font-medium">
                    Cập nhật 30s/lần
                  </span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm italic">
                      Không có thông báo nào
                    </div>
                  ) : (
                    notifications.map((noti) => (
                      <div
                        key={noti.id}
                        onClick={() => markNotificationAsRead(noti.id)}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition cursor-pointer flex gap-3 ${!noti.isRead ? "bg-blue-50/30" : ""}`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-2 shrink-0 ${!noti.isRead ? "bg-blue-500" : "bg-transparent"}`}
                        ></div>
                        <div>
                          <p
                            className={`text-sm ${!noti.isRead ? "font-bold" : "text-gray-600"}`}
                          >
                            {noti.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {noti.message}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-2">
                            {new Date(noti.createdAt).toLocaleString("vi-VN")}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* --- THỐNG KÊ (STATS CARDS) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between border-l-4 border-l-blue-500">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase">
                Tổng khóa học
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {totalCourses}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-xl">
              📚
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between border-l-4 border-l-yellow-500">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase">
                Chờ kiểm duyệt
              </p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">
                {pendingCourses}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center text-xl">
              ⏳
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between border-l-4 border-l-green-500">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase">
                Đã xuất bản
              </p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {approvedCourses}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-xl">
              ✅
            </div>
          </div>
        </div>

        {/* --- BỘ LỌC TABS --- */}
        <div className="bg-white rounded-t-lg border-b border-gray-200 px-6 pt-4 flex gap-6">
          {["ALL", "PENDING", "APPROVED", "REJECTED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`pb-4 font-bold text-sm uppercase tracking-wider transition-colors border-b-2 ${
                filter === tab
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab === "ALL"
                ? "Tất cả"
                : tab === "PENDING"
                  ? "Chờ duyệt"
                  : tab === "APPROVED"
                    ? "Đã duyệt"
                    : "Từ chối"}
            </button>
          ))}
        </div>

        {/* --- BẢNG QUẢN LÝ --- */}
        <div className="bg-white rounded-b-lg shadow-sm border border-gray-200 border-t-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-sm">
                <th className="p-4 font-bold text-gray-600">Khóa học</th>
                <th className="p-4 font-bold text-gray-600">Giảng viên</th>
                <th className="p-4 font-bold text-gray-600">Giá tiền</th>
                <th className="p-4 font-bold text-gray-600 text-center">
                  Trạng thái
                </th>
                <th className="p-4 font-bold text-gray-600 text-right">
                  Thao tác duyệt
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedCourses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    Không tìm thấy khóa học nào trong danh mục này.
                  </td>
                </tr>
              ) : (
                displayedCourses.map((course) => (
                  <tr
                    key={course.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Cột Tên khóa học */}
                    <td className="p-4 flex items-center gap-4">
                      <div className="w-16 h-10 bg-gray-200 rounded overflow-hidden shrink-0 border border-gray-200">
                        {course.thumbnail_url ? (
                          <img
                            src={`http://localhost:5000${course.thumbnail_url}`}
                            alt="thumb"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm line-clamp-1">
                          {course.title}
                        </p>
                        <button
                          onClick={() => navigate(`/course/${course.id}`)}
                          className="text-xs text-blue-500 hover:underline mt-0.5"
                        >
                          Xem trước giao diện
                        </button>
                      </div>
                    </td>

                    {/* Cột Giảng viên */}
                    <td className="p-4 text-sm text-gray-600">
                      {course.lecturer?.name || "Ẩn danh"}
                      <p className="text-xs text-gray-400">
                        {course.lecturer?.email}
                      </p>
                    </td>

                    {/* Cột Giá */}
                    <td className="p-4 text-sm font-medium text-gray-800">
                      {course.price === 0
                        ? "Miễn phí"
                        : `${course.price.toLocaleString()} đ`}
                    </td>

                    {/* Cột Trạng thái */}
                    <td className="p-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                          course.status === "APPROVED"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : course.status === "PENDING"
                              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                              : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {course.status === "APPROVED"
                          ? "ĐÃ DUYỆT"
                          : course.status === "PENDING"
                            ? "CHỜ DUYỆT"
                            : "TỪ CHỐI"}
                      </span>
                    </td>

                    {/* Cột Thao tác */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {course.status !== "APPROVED" && (
                          <button
                            onClick={() =>
                              openModerationModal(course.id, "APPROVED")
                            }
                            className="px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded hover:bg-green-700 transition shadow-sm"
                          >
                            ✓ Duyệt
                          </button>
                        )}
                        {course.status !== "REJECTED" && (
                          <button
                            onClick={() =>
                              openModerationModal(course.id, "REJECTED")
                            }
                            className="px-3 py-1.5 bg-gray-200 text-gray-800 text-xs font-bold rounded hover:bg-red-600 hover:text-white transition shadow-sm"
                          >
                            ✕ Từ chối
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL KIỂM DUYỆT --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div
              className={`p-6 text-white ${moderationData.status === "APPROVED" ? "bg-green-600" : "bg-red-600"}`}
            >
              <h3 className="text-xl font-bold flex items-center gap-2">
                {moderationData.status === "APPROVED"
                  ? "✅ Phê duyệt khóa học"
                  : "❌ Từ chối khóa học"}
              </h3>
              <p className="text-sm opacity-90 mt-1">
                Vui lòng để lại nhận xét hoặc lý do cho giảng viên.
              </p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nhận xét của Admin
              </label>
              <textarea
                value={moderationData.comment}
                onChange={(e) =>
                  setModerationData({
                    ...moderationData,
                    comment: e.target.value,
                  })
                }
                placeholder={
                  moderationData.status === "APPROVED"
                    ? "Ví dụ: Khóa học rất tốt, nội dung đầy đủ..."
                    : "Ví dụ: Nội dung video chưa rõ ràng, cần bổ sung thêm..."
                }
                className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm"
              ></textarea>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleConfirmModeration}
                  className={`px-6 py-2 text-sm font-bold text-white rounded-lg shadow-lg transition ${
                    moderationData.status === "APPROVED"
                      ? "bg-green-600 hover:bg-green-700 shadow-green-600/20"
                      : "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                  }`}
                >
                  Xác nhận{" "}
                  {moderationData.status === "APPROVED" ? "Duyệt" : "Từ chối"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
