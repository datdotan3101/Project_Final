import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "Chào bạn! Mình là Trợ lý ảo của hệ thống. Mình có thể giúp bạn tìm kiếm khóa học hoặc giải đáp thắc mắc gì không?",
      sender: "bot",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Mỗi khi mảng messages thay đổi thì tự động cuộn xuống đáy
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    // Thêm tin nhắn của User vào giao diện
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setInput("");
    setIsLoading(true);

    try {
      // Gọi API Chatbot ở Backend
      const response = await axios.post("http://localhost:5000/api/chat", {
        message: userMessage,
      });

      // Lấy câu trả lời từ Backend (Giả sử BE trả về { reply: "..." } hoặc { message: "..." })
      // Tùy thuộc vào code backend của bạn, hãy sửa lại response.data.reply cho đúng nhé!
      const botReply =
        response.data.reply ||
        response.data.message ||
        "Xin lỗi, mình chưa thể xử lý yêu cầu này.";
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
    } catch (error) {
      console.error("Lỗi Chatbot:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Hệ thống chat đang bảo trì hoặc mất kết nối. Vui lòng thử lại sau nhé!",
          sender: "bot",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* KHUNG CHAT (Chỉ hiện khi isOpen = true) */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 h-[500px] max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 mb-4 transition-all duration-300 transform origin-bottom-right">
          {/* Header */}
          <div className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-inner">
                🤖
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight">Trợ lý ảo</h3>
                <p className="text-xs text-blue-200">
                  Luôn sẵn sàng hỗ trợ bạn
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-blue-700 p-2 rounded-full transition"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          {/* Nội dung Chat */}
          <div
            ref={chatContainerRef}
            className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : msg.isError
                        ? "bg-red-100 text-red-700 rounded-bl-sm border border-red-200"
                        : "bg-white text-gray-800 rounded-bl-sm border border-gray-200"
                  }`}
                >
                  {msg.text}
                  {/* Hiển thị các khóa học gợi ý */}
                  {msg.recommendedCourses &&
                    msg.recommendedCourses.length > 0 && (
                      <div className="mt-3 flex flex-col gap-2">
                        {(msg.recommendedCourses || []).map((course) => (
                          <Link
                            key={course.id}
                            to={`/course/${course.id}`}
                            className="bg-gray-50 border border-gray-100 rounded-lg overflow-hidden flex items-center gap-2 hover:border-blue-300 transition group/item shadow-sm"
                          >
                            <div className="w-16 h-16 shrink-0">
                              <img
                                src={`http://localhost:5000${course.thumbnail_url}`}
                                alt={course.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 pr-2 py-1 overflow-hidden">
                              <h4 className="text-gray-800 font-bold text-[12px] line-clamp-1 group-hover/item:text-blue-600 transition">
                                {course.title}
                              </h4>
                              <p className="text-blue-600 font-bold text-[11px]">
                                {course.price === 0
                                  ? "Miễn phí"
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
                      <div className="mt-3">
                        <Link
                          to={`/checkout/${msg.recommendedCourses[0].id}`}
                          className="block text-center bg-blue-600 text-white font-bold py-2 px-4 rounded-xl shadow-md hover:bg-blue-700 transition active:scale-95 text-xs"
                        >
                          🛒 Thanh toán ngay
                        </Link>
                      </div>
                    )}
                </div>
              </div>
            ))}

            {/* Hiệu ứng "Đang gõ..." */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-500 p-3 rounded-2xl rounded-bl-sm shadow-sm flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Chat */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white border-t border-gray-200 flex gap-2 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              disabled={isLoading}
              className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-full px-4 py-2.5 text-sm outline-none transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <svg
                className="w-4 h-4 ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* NÚT BONG BÓNG CHAT (Floating Button) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 hover:scale-105 transition-all duration-300 animate-bounce group relative"
        >
          {/* Tooltip gợi ý */}
          <span className="absolute right-16 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Chat với hỗ trợ!
          </span>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            ></path>
          </svg>
        </button>
      )}
    </div>
  );
};

export default Chatbot;
