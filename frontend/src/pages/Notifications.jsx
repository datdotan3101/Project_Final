import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const markAsRead = async (id, link) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Update local state
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );

      if (link) navigate(link);
    } catch (error) {
      console.error("Error marking notification as read:", error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-white">Thông báo của bạn</h1>
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={markAllAsRead}
            className="text-blue-400 font-bold hover:text-blue-300 transition text-sm"
          >
            Đánh dấu tất cả là đã đọc
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-[#1c1d1f] border border-slate-800 rounded-2xl p-20 text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
            <span className="material-symbols-outlined text-4xl">
              notifications_off
            </span>
          </div>
          <p className="text-slate-400 font-medium text-lg">
            Bạn chưa có thông báo nào.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id, notification.link)}
              className={`p-6 rounded-2xl border transition cursor-pointer group relative overflow-hidden ${
                notification.isRead
                  ? "bg-[#1c1d1f]/50 border-slate-800 text-slate-400"
                  : "bg-[#1c1d1f] border-blue-500/30 text-white shadow-lg shadow-blue-500/5"
              }`}
            >
              <div className="flex gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    notification.isRead
                      ? "bg-slate-800"
                      : "bg-blue-600/20 text-blue-400"
                  }`}
                >
                  <span className="material-symbols-outlined">
                    {notification.type === "COURSE_MODERATED"
                      ? "verified_user"
                      : "info"}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3
                      className={`font-bold transition ${notification.isRead ? "" : "text-white group-hover:text-blue-400"}`}
                    >
                      {notification.title}
                    </h3>
                    <span className="text-xs font-medium text-slate-500">
                      {formatDistanceToNowVi(new Date(notification.createdAt))}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-3">
                    {notification.message}
                  </p>
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full absolute top-6 right-6"></div>
                  )}
                  {notification.link && (
                    <span className="text-xs font-bold text-blue-400 group-hover:underline">
                      Xem chi tiết &rsaquo;
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
