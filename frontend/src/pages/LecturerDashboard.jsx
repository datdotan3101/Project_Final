import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LecturerDashboard = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/courses/my-courses",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setMyCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Khóa Học</h1>

        {/* Nút Tạo Mới sẽ trỏ đến trang Editor mà KHÔNG có ID */}
        <button
          onClick={() => navigate("/lecturer/course/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md font-bold hover:bg-blue-700 transition flex items-center gap-2"
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
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          Tạo khóa học mới
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Đang tải dữ liệu...</div>
      ) : myCourses.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow-sm text-center border border-gray-200">
          <p className="text-gray-500 mb-4">Bạn chưa tạo khóa học nào.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">Khóa học</th>
                <th className="p-4 font-semibold text-gray-600">Giá</th>
                <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
                <th className="p-4 font-semibold text-gray-600 text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {myCourses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 flex items-center gap-4">
                    <img
                      src={
                        course.thumbnail_url
                          ? `http://localhost:5000${course.thumbnail_url}`
                          : "https://via.placeholder.com/50"
                      }
                      alt="thumbnail"
                      className="w-16 h-10 object-cover rounded border"
                    />
                    <span className="font-medium text-gray-800">
                      {course.title}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {course.price === 0
                      ? "Miễn phí"
                      : `${course.price.toLocaleString()} đ`}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        course.status === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {course.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {/* Nút Chỉnh Sửa trỏ đến trang Editor CÓ ID */}
                    <button
                      onClick={() =>
                        navigate(`/lecturer/course/edit/${course.id}`)
                      }
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Chỉnh sửa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;
