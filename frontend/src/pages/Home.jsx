import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import WishlistButton from "../components/WishlistButton";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= STATE CHO INLINE CHATBOT =================
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false); // Cờ kiểm tra xem đã bắt đầu chat chưa
  const chatContainerRef = useRef(null);

  // Cuộn xuống tin nhắn mới nhất (Chỉ cuộn bên trong khung chat)
  useEffect(() => {
    if (hasStartedChat && chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, hasStartedChat]);

  // Lấy danh sách khóa học
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses");
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách khóa học lúc này.");
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Xử lý gửi tin nhắn AI
  const handleSearchChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setHasStartedChat(true);
    setMessages((prev) => [...prev, { text: userMsg, sender: "user" }]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      // 1. Lấy token từ LocalStorage
      const token = localStorage.getItem("token");

      // 2. Gọi API kèm Header Authorization (nếu có token)
      const response = await axios.post(
        "http://localhost:5000/api/chat",
        { message: userMsg },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );

      const botReply =
        response.data.reply ||
        response.data.message ||
        "Xin lỗi, AI hiện không thể trả lời.";
      const recCourses = response.data.recommendedCourses || [];
      const intent = response.data.intent || "CHITCHAT";

      setMessages((prev) => [
        ...prev,
        {
          text: botReply,
          sender: "bot",
          recommendedCourses: recCourses,
          intent: intent,
        },
      ]);
    } catch (err) {
      console.error(err);

      // Bắt thêm lỗi 401 để báo cho người dùng biết cần đăng nhập
      if (err.response?.status === 401) {
        setMessages((prev) => [
          ...prev,
          {
            text: "Vui lòng đăng nhập để sử dụng Trợ lý AI nhé!",
            sender: "bot",
            isError: true,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            text: "Hệ thống AI đang bảo trì hoặc mất kết nối Ollama. Vui lòng thử lại sau!",
            sender: "bot",
            isError: true,
          },
        ]);
      }
    } finally {
      setIsChatLoading(false);
    }
  };

  // Hàm điền nhanh câu hỏi gợi ý
  const handleSuggestClick = (text) => {
    setChatInput(text);
  };

  return (
    <div className="bg-[#0b1120] min-h-screen text-slate-300 pb-20 font-sans">
      {/* ================= HERO SECTION (AI-GUIDED LEARNING) ================= */}
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
          Unlock your potential with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            AI-guided learning
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
          Describe your career goals or what you want to build to get
          personalized course recommendations instantly.
        </p>

        {/* ================= KHUNG TÌM KIẾM TÍCH HỢP AI CHAT ================= */}
        <div className="relative group text-left">
          {/* Hiệu ứng viền sáng mờ phía sau */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>

          <div className="relative flex flex-col bg-[#1e293b] rounded-xl border border-slate-700 shadow-2xl overflow-hidden z-10">
            {/* Thanh Input */}
            <form onSubmit={handleSearchChat} className="flex items-center p-2">
              <div className="pl-4 pr-2 text-blue-400">
                <svg
                  className="w-6 h-6 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask AI what to learn next..."
                disabled={isChatLoading}
                className="flex-1 bg-transparent border-none text-white px-4 py-3 outline-none placeholder-slate-500 text-lg disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isChatLoading}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Search{" "}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </button>
            </form>

            {/* Khung Lịch sử Trò chuyện (Chỉ mở ra khi đã bắt đầu chat) */}
            {hasStartedChat && (
              <div
                ref={chatContainerRef}
                className="border-t border-slate-700/50 bg-[#0f172a]/80 h-[350px] overflow-y-auto p-4 flex flex-col gap-4"
              >
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-[15px] leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-900/20"
                          : msg.isError
                            ? "bg-red-900/30 text-red-400 rounded-tl-sm border border-red-800"
                            : "bg-[#1e293b] text-slate-300 rounded-tl-sm border border-slate-700 shadow-md"
                      }`}
                    >
                      {msg.text}
                      {/* Hiển thị các khóa học gợi ý */}
                      {msg.recommendedCourses &&
                        msg.recommendedCourses.length > 0 && (
                          <div className="mt-4 grid grid-cols-1 gap-3">
                            {msg.recommendedCourses.map((course) => (
                              <Link
                                key={course.id}
                                to={`/course/${course.id}`}
                                className="bg-[#0f172a] border border-slate-700 rounded-xl overflow-hidden flex items-center gap-3 hover:border-blue-500 transition group/item"
                              >
                                <div className="w-20 h-20 shrink-0">
                                  <img
                                    src={`http://localhost:5000${course.thumbnail_url}`}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 pr-3 py-2 overflow-hidden">
                                  <h4 className="text-white font-bold text-sm line-clamp-1 group-hover/item:text-blue-400 transition">
                                    {course.title}
                                  </h4>
                                  <p className="text-slate-500 text-[11px] mb-1">
                                    {course.lecturer?.name}
                                  </p>
                                  <p className="text-blue-400 font-bold text-xs">
                                    {course.price === 0
                                      ? "Free"
                                      : `${course.price.toLocaleString("vi-VN")} VNĐ`}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}

                      {/* Nút thanh toán nhanh nếu intent là BUY */}
                      {msg.intent === "BUY" &&
                        msg.recommendedCourses &&
                        msg.recommendedCourses.length > 0 && (
                          <div className="mt-4">
                            <Link
                              to={`/checkout/${msg.recommendedCourses[0].id}`}
                              className="block text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-green-500/20 hover:scale-[1.02] transition active:scale-95"
                            >
                              🚀 Thanh toán ngay:{" "}
                              {msg.recommendedCourses[0].title}
                            </Link>
                          </div>
                        )}
                    </div>
                  </div>
                ))}

                {/* Hiệu ứng AI đang gõ */}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#1e293b] border border-slate-700 text-slate-400 p-4 rounded-2xl rounded-tl-sm flex gap-1.5 w-16">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Các thẻ Pill (Gợi ý tìm kiếm) - Chỉ hiện khi chưa chat để đỡ rối */}
        {!hasStartedChat && (
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              onClick={() =>
                handleSuggestClick(
                  "Mình muốn học Python cho Data Science thì bắt đầu từ đâu?",
                )
              }
              className="bg-[#1e293b] hover:bg-[#334155] border border-slate-700 text-slate-300 px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2"
            >
              <span className="text-blue-400">{"</>"}</span> Python for Data
              Science
            </button>
            <button
              onClick={() =>
                handleSuggestClick("Tôi là người mới, muốn học thiết kế đồ họa")
              }
              className="bg-[#1e293b] hover:bg-[#334155] border border-slate-700 text-slate-300 px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2"
            >
              <span className="text-pink-400">✏️</span> Graphic Design for
              Beginners
            </button>
            <button
              onClick={() =>
                handleSuggestClick("Lộ trình học React Native làm app mobile?")
              }
              className="bg-[#1e293b] hover:bg-[#334155] border border-slate-700 text-slate-300 px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2"
            >
              <span className="text-teal-400">📱</span> React Native Masterclass
            </button>
            <button
              onClick={() =>
                handleSuggestClick("Khóa học Digital Marketing cơ bản?")
              }
              className="bg-[#1e293b] hover:bg-[#334155] border border-slate-700 text-slate-300 px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2"
            >
              <span className="text-orange-400">🧩</span> Digital Marketing 101
            </button>
          </div>
        )}
      </div>

      {/* ================= STATS DIVIDER ================= */}
      <div className="border-y border-slate-800 bg-[#0f172a] py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center md:justify-around gap-6 text-sm md:text-base font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>{" "}
            200k+ Online Courses
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              ></path>
            </svg>{" "}
            50M+ Students
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              ></path>
            </svg>{" "}
            Lifetime Access
          </div>
        </div>
      </div>

      {/* ================= COURSE LIST (TRENDING NOW) ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-white tracking-wide">
            Trending Now
          </h2>
          <Link
            to="/courses"
            className="text-blue-500 hover:text-blue-400 font-medium flex items-center gap-1"
          >
            View all{" "}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 border border-red-500/50 text-red-200 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 bg-[#1e293b] rounded-xl border border-slate-800">
            <p className="text-slate-500 text-lg">
              Hiện tại chưa có khóa học nào được xuất bản.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/course/${course.id}`}
                className="group bg-[#1e293b] rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20 transition duration-300 flex flex-col border border-slate-700/50"
              >
                <div className="h-44 bg-slate-800 relative overflow-hidden">
                  <div className="absolute top-3 left-3 bg-yellow-400 text-black text-[10px] font-extrabold px-2 py-1 rounded uppercase tracking-wider z-10 shadow-lg">
                    Bestseller
                  </div>
                  <WishlistButton courseId={course.id} />
                  {course.thumbnail_url ? (
                    <img
                      src={`http://localhost:5000${course.thumbnail_url}`}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition duration-300"></div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-3 text-xs font-medium text-slate-400">
                    <span className="bg-blue-900/30 text-blue-400 px-2.5 py-1 rounded">
                      {course.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>{" "}
                      22h
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-lg line-clamp-2 mb-1 group-hover:text-blue-400 transition">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-3">
                    {course.lecturer?.name || "Ẩn danh"}
                  </p>

                  <div className="flex items-center gap-1.5 mb-4 text-sm">
                    <span className="text-yellow-400 font-bold">4.8</span>
                    <div className="flex text-yellow-400 text-xs">★★★★★</div>
                    <span className="text-slate-500 text-xs">(12,400)</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center gap-3">
                    <span className="font-extrabold text-xl text-white">
                      {course.price === 0
                        ? "Free"
                        : `${course.price.toLocaleString("vi-VN")} VNĐ`}
                    </span>
                    {course.price > 0 && (
                      <span className="text-sm text-slate-500 line-through">
                        {(course.price * 1.5).toLocaleString("vi-VN")} VNĐ
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ================= TOP CATEGORIES ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 mb-16">
        <h2 className="text-3xl font-bold text-white tracking-wide mb-8">
          Top Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            {
              name: "Development",
              icon: (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              ),
            },
            {
              name: "Business",
              icon: (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
            },
            {
              name: "Design",
              icon: (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4 a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.828 2.828a2 2 0 010 2.828l-8.486 8.486L5 21"
                  />
                </svg>
              ),
            },
            {
              name: "Marketing",
              icon: (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                  />
                </svg>
              ),
            },
            {
              name: "IT & Software",
              icon: (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              ),
            },
            {
              name: "Photography",
              icon: (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              ),
            },
            {
              name: "Music",
              icon: (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              ),
            },
            {
              name: "Personal Development",
              icon: (
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              ),
            },
          ].map((category, index) => (
            <Link
              key={index}
              to={`/courses?category=${category.name}`}
              className="bg-[#1e293b] p-8 rounded-xl border border-slate-700/50 hover:bg-[#2d3a4f] hover:border-blue-500 transition-all duration-300 group flex flex-col gap-4 shadow-lg active:scale-[0.98]"
            >
              <div className="text-blue-400 group-hover:scale-110 transition-transform duration-300">
                {category.icon}
              </div>
              <h3 className="font-bold text-white text-lg">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
