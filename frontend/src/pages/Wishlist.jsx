import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/wishlist/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi lấy wishlist:", error);
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (courseId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/wishlist/toggle/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // Cập nhật lại danh sách local
      setCourses(courses.filter((c) => c.id !== courseId));
    } catch (error) {
      console.error("Lỗi xóa khỏi wishlist:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0b1120] min-h-screen pt-24 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b1120] min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-red-500/20 text-red-500 rounded-2xl flex items-center justify-center text-2xl">
            ❤️
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-white">My Wishlist</h1>
            <p className="text-slate-400 mt-1">Courses you're interested in</p>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="bg-[#1e293b] rounded-3xl p-16 text-center border border-slate-800 shadow-xl">
            <div className="text-6xl mb-6">🏜️</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              Go explore thousands of courses and find the one that fits your
              career path!
            </p>
            <Link
              to="/"
              className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-10 rounded-xl transition duration-300"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group bg-[#1e293b] rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-900/20 transition duration-300 flex flex-col border border-slate-700/50"
              >
                <div className="h-48 relative overflow-hidden">
                  <Link to={`/course/${course.id}`}>
                    <img
                      src={`http://localhost:5000${course.thumbnail_url}`}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    />
                  </Link>
                  <button
                    onClick={() => handleRemoveFromWishlist(course.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md text-red-500 rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition duration-300 shadow-lg"
                    title="Remove from wishlist"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-blue-900/40 text-blue-400 text-xs font-bold px-3 py-1 rounded-lg">
                      {course.category}
                    </span>
                  </div>
                  <Link to={`/course/${course.id}`}>
                    <h3 className="font-bold text-white text-xl line-clamp-2 mb-2 group-hover:text-blue-400 transition">
                      {course.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-slate-400 mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    {course.lecturer?.name || "Instructor"}
                  </p>

                  <div className="mt-auto pt-5 border-t border-slate-700/50 flex items-center justify-between">
                    <span className="font-black text-2xl text-white">
                      {course.price === 0
                        ? "Free"
                        : `${course.price.toLocaleString("vi-VN")} VNĐ`}
                    </span>
                    <Link
                      to={`/course/${course.id}`}
                      className="p-2 text-blue-400 hover:text-white transition"
                    >
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
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
