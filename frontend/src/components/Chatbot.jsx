import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useChat } from "../context/ChatContext";

const Chatbot = () => {
  const { isChatOpen, setIsChatOpen } = useChat();
  const isOpen = isChatOpen;
  const setIsOpen = setIsChatOpen;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      text: "👋 Xin chào! Tôi là Trợ lý AI thông minh của EduMarket. Tôi có thể giúp bạn tìm lộ trình học tập, giải đáp kiến thức hoặc gợi ý khóa học phù hợp nhất với bạn. Bạn muốn bắt đầu từ đâu?",
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

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/chat",
        { message: userMessage },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} },
      );

      const botReply =
        response.data.reply ||
        response.data.message ||
        "Xin lỗi, tôi gặp chút trục trặc khi xử lý thông tin.";
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
          text:
            error.response?.status === 401
              ? "Bạn vui lòng đăng nhập để sử dụng toàn bộ tính năng của Trợ lý AI nhé!"
              : "Hệ thống AI đang bảo trì. Vui lòng thử lại sau giây lát!",
          sender: "bot",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* Modal Container */}
      <div className="bg-[#1c2431] w-full max-w-2xl h-[700px] max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-slate-700/50 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white flex justify-between items-center shadow-lg relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16"></div>

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-xl animate-float">
              <span className="material-symbols-outlined text-[32px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-blue-500 bg-clip-text text-transparent font-bold">
                auto_awesome
              </span>
            </div>
            <div>
              <h3 className="font-black text-2xl tracking-tight leading-tight">
                AI Assistant
              </h3>

              <p className="text-blue-100 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Online Support Assistant
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-12 h-12 bg-black/20 hover:bg-black/40 text-white rounded-2xl flex items-center justify-center transition-all active:scale-90 relative z-10"
          >
            <span className="material-symbols-outlined font-black">close</span>
          </button>
        </div>

        {/* Chat History */}
        <div
          ref={chatContainerRef}
          className="flex-1 p-8 overflow-y-auto bg-[#0b1120] flex flex-col gap-6 scrollbar-hide"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-5 rounded-3xl text-sm leading-relaxed shadow-xl border ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white border-blue-500 rounded-br-sm shadow-blue-600/10"
                    : msg.isError
                      ? "bg-red-900/20 text-red-200 border-red-500/30 rounded-bl-sm"
                      : "bg-[#1c2431] text-slate-300 border-slate-700/50 rounded-bl-sm"
                }`}
              >
                <div className="font-medium">{msg.text}</div>

                {/* Recommended Courses */}
                {msg.recommendedCourses &&
                  msg.recommendedCourses.length > 0 && (
                    <div className="mt-6 flex flex-col gap-3">
                      {msg.recommendedCourses.map((course) => (
                        <Link
                          key={course.id}
                          to={`/course/${course.id}`}
                          onClick={() => setIsOpen(false)}
                          className="bg-[#0b1120] border border-slate-700/50 rounded-2xl overflow-hidden flex items-center gap-4 hover:border-blue-500 group/item transition-all duration-300 p-1 pr-4"
                        >
                          <div className="w-20 h-20 shrink-0">
                            <img
                              src={
                                course.thumbnail_url?.startsWith("http")
                                  ? course.thumbnail_url
                                  : `http://localhost:5000${course.thumbnail_url}`
                              }
                              alt={course.title}
                              className="w-full h-full object-cover rounded-xl"
                            />
                          </div>
                          <div className="flex-1 py-2 overflow-hidden">
                            <h4 className="text-white font-black text-sm line-clamp-1 group-hover/item:text-blue-400 transition">
                              {course.title}
                            </h4>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                              {course.lecturer?.name || "Expert Instructor"}
                            </p>
                            <p className="text-blue-400 font-black text-xs">
                              {course.price === 0
                                ? "Free"
                                : `${course.price.toLocaleString("vi-VN")}đ`}
                            </p>
                          </div>
                          <span className="material-symbols-outlined text-slate-700 group-hover/item:text-blue-500 text-sm transition-transform group-hover/item:translate-x-1">
                            arrow_forward
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                {/* Quick Buy Action */}
                {msg.intent === "BUY" && msg.recommendedCourses?.[0] && (
                  <Link
                    to={`/checkout/${msg.recommendedCourses[0].id}`}
                    onClick={() => setIsOpen(false)}
                    className="mt-6 block text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black py-4 px-6 rounded-2xl shadow-xl hover:shadow-green-500/20 transition-all active:scale-95 text-xs uppercase tracking-widest"
                  >
                    🚀 Checkout Now: {msg.recommendedCourses[0].title}
                  </Link>
                )}
              </div>
            </div>
          ))}

          {/* AI Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#1c2431] border border-slate-700/50 text-slate-500 p-4 rounded-2xl rounded-bl-sm shadow-sm flex gap-1.5 w-16 items-center justify-center">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-8 bg-[#1c2431] border-t border-slate-700/50"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-focus-within:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center bg-[#0b1120] border border-slate-700 rounded-2xl p-2 pl-6">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your query to AI..."
                disabled={isLoading}
                className="flex-1 bg-transparent border-none text-white text-sm outline-none transition disabled:opacity-50 py-3"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-lg shadow-blue-600/20 active:scale-90"
              >
                <span className="material-symbols-outlined font-black">
                  send
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
