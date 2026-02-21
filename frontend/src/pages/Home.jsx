import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Gọi API lấy danh sách khóa học (chỉ những khóa đã APPROVED)
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

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* --- HERO BANNER --- */}
      <div className="bg-blue-600 text-white py-16 px-4 sm:px-6 lg:px-8 mb-10 shadow-inner">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            Học hỏi kỹ năng mới, mở ra cơ hội mới
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mb-8">
            Khám phá hàng ngàn khóa học chất lượng cao từ các chuyên gia hàng
            đầu. Bắt đầu hành trình của bạn ngay hôm nay.
          </p>
        </div>
      </div>

      {/* --- COURSE LIST --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Khóa Học Nổi Bật
        </h2>

        {/* Xử lý trạng thái Loading và Error */}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải khóa học...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-md text-center">
            {error}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-500 text-lg">
              Hiện tại chưa có khóa học nào được xuất bản.
            </p>
          </div>
        ) : (
          /* Grid hiển thị danh sách khóa học */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/course/${course.id}`} // Click vào thẻ sẽ chuyển sang trang Chi tiết khóa học
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                {/* Ảnh Thumbnail */}
                <div className="h-40 bg-gray-200 overflow-hidden relative">
                  {course.thumbnail_url ? (
                    <img
                      // Nối URL backend với đường dẫn ảnh lưu trong DB
                      src={`http://localhost:5000${course.thumbnail_url}`}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      Không có ảnh
                    </div>
                  )}
                </div>

                {/* Thông tin khóa học */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-gray-800 text-lg line-clamp-2 mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    Giảng viên: {course.lecturer?.name || "Ẩn danh"}
                  </p>

                  {/* Đẩy giá tiền xuống đáy của thẻ */}
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="font-bold text-xl text-gray-900">
                      {course.price === 0
                        ? "Miễn phí"
                        : `${course.price.toLocaleString("vi-VN")} đ`}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
