import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const formatDistanceToNowVi = (date) => {
  const diffInSeconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (diffInSeconds < 60) return "vừa xong";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} giờ trước`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} ngày trước`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} tháng trước`;
  return `${Math.floor(diffInMonths / 12)} năm trước`;
};

const DashboardNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const isAdmin = user?.role === "ADMIN";
  const isLecturer = user?.role === "LECTURER";

  useEffect(() => {
    fetchNotifications();
  }, []);

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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  const markAsRead = async (e, id, link) => {
    if (e) e.stopPropagation();

    const notification = notifications.find((n) => n.id === id);
    if (!notification) return;

    if (!notification.isRead) {
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `http://localhost:5000/api/notifications/${id}/read`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    if (link) navigate(link);
  };

  const toggleReadStatusOnly = async (e, id, currentStatus) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      // For now, our backend only has markAsRead (true).
      // If we wanted toggle, we'd need another endpoint or param.
      // But we can at least make it "Read" without navigating.
      if (!currentStatus) {
        await axios.put(
          `http://localhost:5000/api/notifications/${id}/read`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        );
      }
    } catch (error) {
      console.error("Error toggling read status:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5000/api/notifications/mark-all-read",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "system")
      return n.type === "COURSE_MODERATED" || n.type === "SYSTEM";
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b1120] min-h-screen text-slate-300 font-sans pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                to={
                  isAdmin
                    ? "/admin/dashboard"
                    : isLecturer
                      ? "/lecturer/dashboard"
                      : "/"
                }
                className="text-blue-400 hover:text-blue-300 font-bold text-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">
                  arrow_back
                </span>
                Trở lại{" "}
                {isAdmin
                  ? "Admin Dashboard"
                  : isLecturer
                    ? "Lecturer Dashboard"
                    : "Trang chủ"}
              </Link>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              Trung tâm thông báo
            </h1>
            <p className="text-slate-400 font-medium">
              Theo dõi các cập nhật quan trọng về{" "}
              {isAdmin ? "hệ thống và quản trị" : "khóa học và hệ thống"} của
              bạn.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={markAllAsRead}
              className="bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 border border-blue-500/20"
            >
              Đánh dấu tất cả là đã đọc
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar / Filters */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-4 sticky top-24">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">
                Bộ lọc
              </h2>
              <div className="space-y-1">
                {[
                  { id: "all", label: "Tất cả thông báo", icon: "all_inbox" },
                  {
                    id: "unread",
                    label: "Chưa đọc",
                    icon: "mark_as_unread",
                    count: notifications.filter((n) => !n.isRead).length,
                  },
                  {
                    id: "system",
                    label: "Hệ thống",
                    icon: "admin_panel_settings",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setFilter(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition font-bold text-sm ${
                      filter === item.id
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-lg">
                        {item.icon}
                      </span>
                      {item.label}
                    </div>
                    {item.count > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] ${filter === item.id ? "bg-white text-blue-600" : "bg-red-500 text-white"}`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-slate-700/50">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">
                  Người dùng
                </h2>
                <div className="px-4 py-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                    {user?.full_name?.charAt(0) || "U"}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white truncate max-w-[100px]">
                      {user?.full_name}
                    </div>
                    <div className="text-[10px] text-slate-500 uppercase font-black">
                      {user?.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1">
            {filteredNotifications.length === 0 ? (
              <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-20 text-center shadow-2xl">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-600">
                  <span className="material-symbols-outlined text-5xl">
                    notifications_off
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">
                  Không có thông báo nào
                </h3>
                <p className="text-slate-500 max-w-sm mx-auto font-medium">
                  Hiện tại không có thông báo nào trong danh mục này.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() =>
                      markAsRead(null, notification.id, notification.link)
                    }
                    className={`group relative p-6 rounded-2xl border transition duration-300 cursor-pointer overflow-hidden ${
                      notification.isRead
                        ? "bg-[#1e293b]/30 border-slate-800 text-slate-500 hover:border-slate-700"
                        : "bg-[#1e293b] border-blue-500/30 text-white shadow-xl shadow-blue-500/5 hover:border-blue-500/60"
                    }`}
                  >
                    <div className="flex items-start gap-5 relative z-10">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110 ${
                          notification.isRead
                            ? "bg-slate-800/50 text-slate-600"
                            : notification.type === "COURSE_MODERATED"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-blue-600/20 text-blue-400"
                        }`}
                      >
                        <span className="material-symbols-outlined text-2xl">
                          {notification.isRead
                            ? notification.type === "COURSE_MODERATED"
                              ? "verified"
                              : "drafts"
                            : notification.type === "COURSE_MODERATED"
                              ? "notifications_active"
                              : "mail"}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start gap-4 mb-2">
                          <h3
                            className={`text-lg font-extrabold transition-colors ${notification.isRead ? "text-slate-400" : "text-white group-hover:text-blue-400"}`}
                          >
                            {notification.title}
                          </h3>
                          <div className="flex flex-col items-end gap-2">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter whitespace-nowrap bg-slate-800/80 px-2 py-1 rounded">
                              {formatDistanceToNowVi(
                                new Date(notification.createdAt),
                              )}
                            </span>
                            {!notification.isRead && (
                              <button
                                onClick={(e) =>
                                  toggleReadStatusOnly(
                                    e,
                                    notification.id,
                                    false,
                                  )
                                }
                                className="text-[10px] text-blue-400 hover:text-white font-bold underline decoration-blue-500/30 underline-offset-2"
                              >
                                Đánh dấu đã đọc
                              </button>
                            )}
                          </div>
                        </div>
                        <p
                          className={`text-sm leading-relaxed mb-4 max-w-3xl ${notification.isRead ? "text-slate-500" : "text-slate-300"}`}
                        >
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {!notification.isRead && (
                              <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-400">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                                Mới
                              </span>
                            )}
                            <span
                              className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
                                notification.type === "COURSE_MODERATED"
                                  ? notification.isRead
                                    ? "text-green-500/50 bg-green-500/5"
                                    : "text-green-500 bg-green-500/10"
                                  : notification.isRead
                                    ? "text-blue-500/50 bg-blue-500/5"
                                    : "text-blue-500 bg-blue-500/10"
                              }`}
                            >
                              {notification.type === "COURSE_MODERATED"
                                ? "Hệ thống"
                                : "Thông báo"}
                            </span>
                          </div>
                          {notification.link && (
                            <div
                              className={`font-black text-xs uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-all ${
                                notification.isRead
                                  ? "text-slate-600"
                                  : "text-blue-400 group-hover:text-blue-300"
                              }`}
                            >
                              Chi tiết
                              <span className="material-symbols-outlined text-sm">
                                chevron_right
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Background glow effects for unread messages */}
                    {!notification.isRead && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/10 transition-colors"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNotifications;
