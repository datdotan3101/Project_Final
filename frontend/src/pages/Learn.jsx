import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Learn = () => {
  const { id } = useParams(); // ID của khóa học
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);

  // State quản lý tiến độ học tập
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 1. Fetch dữ liệu khóa học và tiến độ khi vào trang
  useEffect(() => {
    const fetchLearningData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        // Chạy song song 2 API cho nhanh
        const [courseRes, progressRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/courses/${id}`),
          axios.get(`http://localhost:5000/api/progress/courses/${id}`, {
            headers,
          }),
        ]);

        const courseData = courseRes.data;
        setCourse(courseData);

        // Cập nhật state tiến độ
        setCompletedLessonIds(progressRes.data.completed_lesson_ids || []);
        setProgressPercentage(progressRes.data.progress_percentage || 0);
        setTotalLessons(progressRes.data.total_lessons || 0);

        // Tự động chọn bài học đầu tiên nếu có
        if (courseData.sections && courseData.sections.length > 0) {
          const firstSectionWithLessons = courseData.sections.find(
            (s) => s.lessons && s.lessons.length > 0,
          );
          if (firstSectionWithLessons) {
            setCurrentLesson(firstSectionWithLessons.lessons[0]);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        // Nếu lỗi 403 (Chưa mua khóa học) -> Đá về trang chi tiết
        if (err.response?.status === 403) {
          alert("Bạn chưa sở hữu khóa học này!");
          navigate(`/course/${id}`);
        } else {
          setError("Không thể tải dữ liệu phòng học.");
          setLoading(false);
        }
      }
    };

    fetchLearningData();
  }, [id, navigate]);

  // 2. Hàm xử lý khi bấm "Đánh dấu hoàn thành"
  // Thêm tham số 'e' (event) và 'toggleLessonId'
  const handleToggleProgress = async (e, toggleLessonId) => {
    // Ngăn chặn sự kiện click lan ra ngoài thẻ <li> (Giúp không bị load lại video khi chỉ muốn tích xanh)
    if (e) e.stopPropagation();

    if (!toggleLessonId) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/progress/lessons/${toggleLessonId}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const isCompleted = response.data.is_completed;

      // Cập nhật lại UI (Optimistic Update)
      let newCompletedIds = [...completedLessonIds];

      if (isCompleted) {
        newCompletedIds.push(toggleLessonId);
      } else {
        newCompletedIds = newCompletedIds.filter(
          (lid) => lid !== toggleLessonId,
        );
      }

      setCompletedLessonIds(newCompletedIds);

      // Tính toán lại thanh phần trăm
      const newPercentage =
        totalLessons === 0
          ? 0
          : Math.round((newCompletedIds.length / totalLessons) * 100);
      setProgressPercentage(newPercentage);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu tiến độ học tập.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-sm text-lg mb-4">
          {error}
        </div>
        <Link to="/my-learning" className="text-blue-600 underline">
          Quay lại khóa học của tôi
        </Link>
      </div>
    );
  }

  // Cờ kiểm tra bài học hiện tại đã hoàn thành chưa
  const isCurrentLessonCompleted = currentLesson
    ? completedLessonIds.includes(currentLesson.id)
    : false;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
      {/* ================= CỘT TRÁI: KHU VỰC HỌC CHÍNH ================= */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">
        {/* Header nhỏ: Nút quay lại */}
        <div className="h-14 bg-gray-900 text-white flex items-center px-4 flex-shrink-0">
          <Link
            to="/my-learning"
            className="flex items-center text-sm font-medium hover:text-blue-400 transition"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            Quay lại
          </Link>
          <span className="ml-4 pl-4 border-l border-gray-700 font-bold truncate">
            {course.title}
          </span>
        </div>

        {/* Nội dung bài học (Video / Text) */}
        <div className="flex-1 bg-black flex items-center justify-center relative">
          {currentLesson ? (
            currentLesson.content_type === "VIDEO" ? (
              // Trình phát Video
              <video
                key={currentLesson.id} // Ép React render lại video khi đổi bài
                className="w-full h-full max-h-[70vh] object-contain"
                controls
                autoPlay
                controlsList="nodownload"
              >
                <source
                  src={`http://localhost:5000${currentLesson.content_url_or_text}`}
                  type="video/mp4"
                />
                Trình duyệt của bạn không hỗ trợ thẻ video.
              </video>
            ) : (
              // Trình đọc Text
              <div className="w-full h-full max-h-[70vh] bg-white text-gray-800 p-8 md:p-16 overflow-y-auto prose max-w-none">
                <h2 className="text-2xl font-bold mb-6">
                  {currentLesson.title}
                </h2>
                <div className="whitespace-pre-wrap text-lg leading-relaxed">
                  {currentLesson.content_url_or_text}
                </div>
              </div>
            )
          ) : (
            <div className="text-gray-400">
              Vui lòng chọn một bài học ở danh sách bên cạnh.
            </div>
          )}
        </div>

        {/* Khu vực thông tin bài học và Nút Đánh dấu hoàn thành */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center border-t border-gray-200 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentLesson?.title || "Đang tải..."}
            </h2>
            <p className="text-gray-500">Giảng viên: {course.lecturer?.name}</p>
          </div>

          {currentLesson && (
            <button
              onClick={(e) => handleToggleProgress(e, currentLesson.id)}
              className={`mt-4 md:mt-0 px-6 py-3 rounded-md font-bold flex items-center transition ${
                isCurrentLessonCompleted
                  ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isCurrentLessonCompleted ? (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Đã hoàn thành
                </>
              ) : (
                "Đánh dấu hoàn thành"
              )}
            </button>
          )}
        </div>
      </div>

      {/* ================= CỘT PHẢI: SIDEBAR GIÁO TRÌNH ================= */}
      <div className="w-full md:w-80 lg:w-96 bg-white border-l border-gray-200 flex flex-col flex-shrink-0 h-[50vh] md:h-screen">
        {/* Header Sidebar & Thanh Progress Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-bold text-gray-800 mb-3">Nội dung khóa học</h3>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>Tiến độ của bạn</span>
            <span className="font-bold text-blue-600">
              {progressPercentage}%
            </span>
          </div>
          {/* Thanh phần trăm */}
          <div className="w-full bg-gray-300 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-right">
            {completedLessonIds.length} / {totalLessons} bài học
          </div>
        </div>

        {/* Danh sách Section & Lesson */}
        <div className="flex-1 overflow-y-auto">
          {course.sections?.map((section, index) => (
            <div key={section.id} className="border-b border-gray-200">
              <div className="bg-gray-100 p-4 font-bold text-gray-800 text-sm">
                Phần {index + 1}: {section.title}
              </div>

              <ul className="divide-y divide-gray-100">
                {section.lessons?.map((lesson) => {
                  const isCompleted = completedLessonIds.includes(lesson.id);
                  const isActive = currentLesson?.id === lesson.id;

                  return (
                    <li
                      key={lesson.id}
                      onClick={() => setCurrentLesson(lesson)} // Click đổi bài học
                      className={`p-4 flex items-start gap-3 cursor-pointer transition ${
                        isActive
                          ? "bg-blue-50 border-l-4 border-blue-600"
                          : "hover:bg-gray-50 border-l-4 border-transparent"
                      }`}
                    >
                      {/* Cột Checkbox */}
                      <div
                        className="mt-0.5 flex-shrink-0 z-10"
                        onClick={(e) => handleToggleProgress(e, lesson.id)}
                      >
                        {isCompleted ? (
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-green-600 transition">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300 hover:border-blue-500 transition"></div>
                        )}
                      </div>

                      {/* Tên bài học */}
                      <div className="flex-1">
                        <span
                          className={`text-sm ${isCompleted ? "text-gray-500 line-through" : "text-gray-800"} ${isActive ? "font-bold" : ""}`}
                        >
                          {lesson.title}
                        </span>

                        {/* Biểu tượng Loại bài học (Text / Video) */}
                        <div className="flex items-center mt-1 text-xs text-gray-400">
                          {lesson.content_type === "VIDEO" ? (
                            <>
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                              </svg>{" "}
                              Video
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-3 h-3 mr-1"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>{" "}
                              Bài đọc
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Learn;
