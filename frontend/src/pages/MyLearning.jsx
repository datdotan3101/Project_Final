import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyLearning = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        // Lấy token từ Local Storage
        const token = localStorage.getItem("token");

        // Gọi API lấy danh sách khóa học đã mua
        const response = await axios.get(
          "http://localhost:5000/api/my-learning",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setEnrolledCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách khóa học của bạn lúc này.");
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header của trang */}
        <div className="mb-8 border-b border-gray-200 pb-5">
          <h1 className="text-3xl font-bold text-gray-900">Khóa học của tôi</h1>
        </div>

        {/* Xử lý trạng thái Loading và Error */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Đang tải tủ sách của bạn...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md text-center">
            {error}
          </div>
        ) : enrolledCourses.length === 0 ? (
          /* Trạng thái trống (Chưa mua khóa nào) */
          <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center">
            <svg
              className="w-20 h-20 text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Bạn chưa sở hữu khóa học nào
            </h2>
            <p className="text-gray-500 mb-6">
              Hãy khám phá các khóa học hấp dẫn và bắt đầu hành trình học tập
              ngay hôm nay!
            </p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-700 transition"
            >
              Khám phá khóa học
            </Link>
          </div>
        ) : (
          /* Grid hiển thị danh sách khóa học đã mua */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {enrolledCourses.map((item) => {
              const course = item.course; // Dữ liệu trả về từ API nằm trong object 'course'

              return (
                <div
                  key={item.enrollment_id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  {/* Ảnh Thumbnail */}
                  <div className="h-40 bg-gray-200 overflow-hidden relative">
                    {course.thumbnail_url ? (
                      <img
                        src={`http://localhost:5000${course.thumbnail_url}`}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Không có ảnh
                      </div>
                    )}

                    {/* Lớp phủ hover để hiện nút Play (tùy chọn UI đẹp) */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <svg
                        className="w-12 h-12 text-white opacity-80"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>

                  {/* Thông tin khóa học */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-gray-800 text-lg line-clamp-2 mb-1">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Giảng viên: {course.lecturer?.name || "Ẩn danh"}
                    </p>

                    {/* Nút Vào học đẩy xuống đáy */}
                    <div className="mt-auto pt-2 border-t border-gray-100">
                      {/* Tạm thời link đến trang chi tiết, sau này sẽ link đến trang Video Học (/learn/:id) */}
                      <Link
                        to={`/learn/${course.id}`}
                        className="block w-full text-center py-2 bg-blue-50 text-blue-600 font-bold rounded hover:bg-blue-100 transition"
                      >
                        Vào học ngay
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;
