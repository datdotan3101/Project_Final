import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

const Learning = () => {
  const { id } = useParams(); // ID của khóa học lấy từ URL

  // Dữ liệu mô phỏng cấu trúc khóa học từ Backend
  const courseData = {
    title: "2024 Complete Python Bootcamp: From Zero to Hero in Python",
    sections: [
      {
        id: 1,
        title: "Section 1: Course Overview and Setup",
        lessons: [
          {
            id: 101,
            title: "Course Intro",
            duration: "03:45",
            type: "video",
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          },
          {
            id: 102,
            title: "Course FAQs",
            duration: "02:10",
            type: "text",
            content:
              "Hãy đọc kỹ tài liệu này trước khi bắt đầu khóa học nhé. Nó sẽ giải đáp 90% thắc mắc của bạn.",
          },
          {
            id: 103,
            title: "How to get help",
            duration: "05:20",
            type: "video",
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          },
        ],
      },
      {
        id: 2,
        title: "Section 2: Python Setup",
        lessons: [
          {
            id: 201,
            title: "Command Line Basics",
            duration: "12:15",
            type: "video",
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
          },
          {
            id: 202,
            title: "Installing Python on Windows",
            duration: "08:30",
            type: "video",
            url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
          },
        ],
      },
    ],
  };

  // State quản lý bài học đang mở
  const [activeLesson, setActiveLesson] = useState(
    courseData.sections[0].lessons[0],
  );

  // State quản lý mảng ID các bài học đã hoàn thành (Mô phỏng Progress)
  const [completedLessons, setCompletedLessons] = useState([101]);

  // State quản lý việc đóng/mở các Section (Accordion)
  const [expandedSections, setExpandedSections] = useState([1]);

  // State tab bên dưới video (Overview / Q&A)
  const [activeTab, setActiveTab] = useState("overview");

  // Tổng số bài học
  const totalLessons = courseData.sections.reduce(
    (acc, sec) => acc + sec.lessons.length,
    0,
  );
  const progressPercentage = Math.round(
    (completedLessons.length / totalLessons) * 100,
  );

  // Hàm xử lý khi click checkbox hoàn thành bài học
  const toggleComplete = (lessonId, e) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài làm chuyển bài học
    setCompletedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId],
    );
    // TODO: Gọi API /api/progress/lessons/:lessonId/toggle ở đây
  };

  // Hàm mở/đóng section
  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId],
    );
  };

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 font-sans min-h-screen flex flex-col h-screen overflow-hidden">
      {/* Top Navbar (Tối giản để tập trung học) */}
      <header className="flex-shrink-0 h-14 bg-[#111722] text-white flex items-center justify-between px-4 border-b border-slate-800 z-20">
        <div className="flex items-center gap-4">
          <Link
            to="/my-learning"
            className="flex items-center justify-center p-2 hover:bg-slate-800 rounded-lg transition-colors group"
          >
            <span className="material-symbols-outlined text-slate-400 group-hover:text-white">
              chevron_left
            </span>
          </Link>
          <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <div className="size-8 hidden sm:flex items-center justify-center rounded bg-[#135bec]/20 text-[#135bec]">
              <span className="material-symbols-outlined text-xl">school</span>
            </div>
            <h1 className="font-bold text-sm sm:text-base line-clamp-1">
              {courseData.title}
            </h1>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-bold text-slate-300">
              {progressPercentage}% Hoàn thành
            </span>
          </div>
          <div className="w-12 h-12 relative flex items-center justify-center">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 36 36"
            >
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-slate-700"
                strokeWidth="3"
              ></circle>
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-[#135bec] transition-all duration-500"
                strokeWidth="3"
                strokeDasharray="100"
                strokeDashoffset={100 - progressPercentage}
              ></circle>
            </svg>
            <span className="absolute text-xs font-bold text-[#135bec] material-symbols-outlined text-[16px]">
              {progressPercentage === 100 ? "emoji_events" : "trending_up"}
            </span>
          </div>
        </div>
      </header>

      {/* Main Learning Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Side: Video & Content */}
        <div className="flex-1 flex flex-col h-full overflow-y-auto custom-scrollbar relative">
          {/* Player Container */}
          <div className="w-full bg-black aspect-video max-h-[70vh] flex items-center justify-center relative">
            {activeLesson.type === "video" ? (
              <video
                key={activeLesson.id} // Key quan trọng để React reload lại video khi đổi URL
                controls
                autoPlay
                className="w-full h-full object-contain"
                src={activeLesson.url}
              >
                Trình duyệt của bạn không hỗ trợ thẻ video.
              </video>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-8 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">
                  article
                </span>
                <h2 className="text-2xl font-bold mb-2">
                  {activeLesson.title}
                </h2>
                <p className="text-slate-400 max-w-2xl">
                  {activeLesson.content}
                </p>
              </div>
            )}
          </div>

          {/* Content Below Video */}
          <div className="max-w-[1000px] w-full mx-auto p-6 lg:p-8 flex-1">
            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-slate-200 dark:border-slate-800 mb-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-4 text-sm font-bold transition-colors relative ${activeTab === "overview" ? "text-[#135bec]" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
              >
                Tổng quan
                {activeTab === "overview" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#135bec]"></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab("qa")}
                className={`pb-4 text-sm font-bold transition-colors relative ${activeTab === "qa" ? "text-[#135bec]" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"}`}
              >
                Hỏi đáp (Q&A)
                {activeTab === "qa" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#135bec]"></span>
                )}
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
                    Về bài học này
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    Đây là nội dung chi tiết của bài học:{" "}
                    <strong className="text-[#135bec]">
                      {activeLesson.title}
                    </strong>
                    . Bạn có thể theo dõi video phía trên. Nếu là bài tập thực
                    hành, hãy mở IDE của bạn lên và làm theo hướng dẫn.
                  </p>
                </div>
                <hr className="border-slate-200 dark:border-slate-800" />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">
                    Người hướng dẫn
                  </span>
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80"
                      alt="Instructor"
                      className="size-10 rounded-full object-cover"
                    />
                    <span className="font-bold text-sm text-[#135bec]">
                      Jose Portilla
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "qa" && (
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="size-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center font-bold">
                    You
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Bạn có câu hỏi gì cho bài học này?"
                      className="w-full bg-white dark:bg-[#1e293b] border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#135bec] outline-none min-h-[100px]"
                    ></textarea>
                    <div className="flex justify-end mt-2">
                      <button className="px-4 py-2 bg-[#135bec] text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors">
                        Gửi câu hỏi
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sample Comment */}
                <div className="mt-8 space-y-6">
                  <div className="flex gap-4">
                    <img
                      src="https://ui-avatars.com/api/?name=Anna+Smith&background=random"
                      className="size-10 rounded-full"
                      alt="Avatar"
                    />
                    <div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          Anna Smith
                        </span>
                        <span className="text-xs text-slate-500">
                          2 ngày trước
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        Đoạn code ở phút 02:15 bị lỗi syntax trên Python 3.12
                        đúng không mọi người?
                      </p>
                      <button className="text-xs font-bold text-slate-500 hover:text-[#135bec] mt-2 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          reply
                        </span>{" "}
                        Trả lời
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Course Content Sidebar */}
        <div className="w-full lg:w-[400px] flex-shrink-0 bg-white dark:bg-[#1e293b] border-l border-slate-200 dark:border-slate-800 flex flex-col h-full lg:h-[calc(100vh-56px)] z-10 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.1)]">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-[#1e293b] z-10">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
              Nội dung khóa học
            </h2>
            <button className="lg:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {courseData.sections.map((section, index) => {
              const isExpanded = expandedSections.includes(section.id);

              // Tính số bài hoàn thành trong section này
              const completedInSection = section.lessons.filter((l) =>
                completedLessons.includes(l.id),
              ).length;

              return (
                <div
                  key={section.id}
                  className="border-b border-slate-200 dark:border-slate-800"
                >
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-4 flex flex-col gap-1 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <div className="w-full flex justify-between items-center">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight pr-4">
                        {section.title}
                      </h3>
                      <span
                        className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                      >
                        expand_more
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {completedInSection} / {section.lessons.length} | 15 min
                    </span>
                  </button>

                  {/* Lessons List */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    {section.lessons.map((lesson) => {
                      const isActive = activeLesson.id === lesson.id;
                      const isCompleted = completedLessons.includes(lesson.id);

                      return (
                        <div
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`flex gap-3 p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isActive ? "bg-[#135bec]/5 dark:bg-[#135bec]/10 relative" : ""}`}
                        >
                          {/* Dấu gạch xanh chỉ báo đang chọn */}
                          {isActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#135bec]"></div>
                          )}

                          {/* Checkbox (Ngăn chặn click lan ra row) */}
                          <div
                            className="pt-0.5 relative z-10"
                            onClick={(e) => toggleComplete(lesson.id, e)}
                          >
                            <div
                              className={`size-5 rounded border flex items-center justify-center transition-colors cursor-pointer ${isCompleted ? "bg-[#135bec] border-[#135bec]" : "border-slate-400 dark:border-slate-500 hover:border-[#135bec]"}`}
                            >
                              {isCompleted && (
                                <span className="material-symbols-outlined text-white text-[14px] font-bold">
                                  check
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <h4
                              className={`text-sm mb-1 line-clamp-2 ${isActive ? "font-bold text-[#135bec] dark:text-[#5c8dff]" : "text-slate-700 dark:text-slate-300"}`}
                            >
                              {lesson.id}. {lesson.title}
                            </h4>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                              <span className="material-symbols-outlined text-[14px]">
                                {lesson.type === "video"
                                  ? "play_circle"
                                  : "article"}
                              </span>
                              <span>{lesson.duration}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Style CSS tự tạo cho thanh cuộn mảnh (chỉ áp dụng trang này) */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
      `}</style>
    </div>
  );
};

export default Learning;
