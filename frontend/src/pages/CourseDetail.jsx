import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const CourseDetail = () => {
  const { id } = useParams(); // Lấy ID khóa học từ URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

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
        setError(
          "Không thể tải thông tin khóa học hoặc khóa học không tồn tại.",
        );
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // Xử lý khi bấm nút "Mua Ngay"
  const handleBuyNow = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để mua khóa học!");
      navigate("/login");
      return;
    }

    // Thay vì gọi API, ta chuyển hướng người dùng sang trang Checkout kèm theo ID khóa học
    navigate(`/checkout/${course.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow-sm text-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-12">
      {/* --- PHẦN HEADER ĐEN GIỐNG UDEMY --- */}
      <div className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          {/* Cột thông tin (Trái) */}
          <div className="flex-1 md:pr-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {course.title}
            </h1>
            <p className="text-lg text-gray-300 mb-6">{course.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Được tạo bởi:</span>
              <span className="text-blue-300 underline font-medium">
                {course.lecturer?.name || "Ẩn danh"}
              </span>
            </div>
          </div>

          {/* Cột Thẻ mua hàng (Phải - Hiển thị trên Desktop) */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <div className="bg-white text-gray-900 rounded-lg shadow-xl overflow-hidden relative top-0 border border-gray-200">
              {course.thumbnail_url ? (
                <img
                  src={`http://localhost:5000${course.thumbnail_url}`}
                  alt={course.title}
                  className="w-full h-44 object-cover"
                />
              ) : (
                <div className="w-full h-44 bg-gray-200 flex items-center justify-center text-gray-500">
                  Không có ảnh bìa
                </div>
              )}
              <div className="p-6 flex flex-col gap-4">
                <div className="text-3xl font-bold">
                  {course.price === 0
                    ? "Miễn phí"
                    : `${course.price.toLocaleString("vi-VN")} đ`}
                </div>
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition"
                >
                  Mua Ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- NỘI DUNG GIÁO TRÌNH (CURRICULUM) --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-10">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Nội dung khóa học
          </h2>

          {course.sections && course.sections.length > 0 ? (
            <div className="border border-gray-300 rounded-md overflow-hidden shadow-sm">
              {course.sections.map((section, index) => (
                <div
                  key={section.id}
                  className="border-b border-gray-300 last:border-b-0"
                >
                  {/* Tên Section */}
                  <div className="bg-gray-50 p-4 font-bold text-gray-800 flex justify-between items-center">
                    <span>
                      Phần {index + 1}: {section.title}
                    </span>
                    <span className="text-sm font-normal text-gray-500">
                      {section.lessons?.length || 0} bài học
                    </span>
                  </div>

                  {/* Danh sách Lesson bên trong */}
                  <div className="bg-white p-0">
                    {section.lessons && section.lessons.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {section.lessons.map((lesson) => (
                          <li
                            key={lesson.id}
                            className="p-4 flex items-center gap-3 hover:bg-gray-50 transition"
                          >
                            {/* Icon Video hoặc Text */}
                            {lesson.content_type === "VIDEO" ? (
                              <svg
                                className="w-5 h-5 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"></path>
                              </svg>
                            ) : (
                              <svg
                                className="w-5 h-5 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            )}
                            <span className="text-gray-700">
                              {lesson.title}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="p-4 text-sm text-gray-500 italic">
                        Chưa có bài học nào trong phần này.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 bg-gray-50 p-4 rounded-md border border-gray-200">
              Khóa học này chưa cập nhật nội dung.
            </p>
          )}
        </div>

        {/* Cột Sidebar ảo để giữ layout 2 cột không bị tràn dòng */}
        <div className="hidden md:block w-80 flex-shrink-0"></div>
      </div>

      {/* --- THẺ MUA HÀNG MOBILE (Dính chặt dưới đáy màn hình) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-2xl flex items-center justify-between z-50">
        <div className="text-2xl font-bold text-gray-900">
          {course.price === 0
            ? "Miễn phí"
            : `${course.price?.toLocaleString("vi-VN")} đ`}
        </div>
        <button
          onClick={handleBuyNow}
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition"
        >
          Mua Ngay
        </button>
      </div>
    </div>
  );
};

export default CourseDetail;
