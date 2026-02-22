import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import WishlistButton from "../components/WishlistButton";

const Courses = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const url = categoryFilter
          ? `http://localhost:5000/api/courses?category=${categoryFilter}`
          : "http://localhost:5000/api/courses";
        const response = await axios.get(url);
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách khóa học.");
        setLoading(false);
      }
    };
    fetchCourses();
  }, [categoryFilter]);

  return (
    <div className="bg-[#0b1120] min-h-screen text-slate-300 pb-20 font-sans pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 border-b border-slate-800 pb-8">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            {categoryFilter ? (
              <>
                Courses in{" "}
                <span className="text-blue-400">{categoryFilter}</span>
              </>
            ) : (
              "All Courses"
            )}
          </h1>
          <p className="text-slate-400 text-lg">
            Explore our curated list of professional courses and start your
            learning journey today.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-blue-400 font-medium">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-6 rounded-xl text-center">
            <p className="text-xl font-bold mb-2">Oops!</p>
            <p>{error}</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-24 bg-[#1e293b] rounded-2xl border border-slate-800 shadow-xl">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-white mb-2">
              No courses found
            </h2>
            <p className="text-slate-500 mb-8 px-4">
              We couldn't find any courses matching "{categoryFilter}". Check
              back later or try a different category!
            </p>
            <Link
              to="/"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition duration-200"
            >
              Browse All Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/course/${course.id}`}
                className="group bg-[#1e293b] rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.2)] transition-all duration-300 flex flex-col border border-slate-700/50"
              >
                {/* Image Section */}
                <div className="h-48 bg-slate-800 relative overflow-hidden">
                  <div className="absolute top-4 left-4 bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest z-10 shadow-lg">
                    HOT
                  </div>
                  <WishlistButton courseId={course.id} />
                  {course.thumbnail_url ? (
                    <img
                      src={`http://localhost:5000${course.thumbnail_url}`}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 bg-gradient-to-br from-slate-900 to-slate-800">
                      <span className="material-symbols-outlined text-4xl">
                        image
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition duration-300"></div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-blue-900/40 text-blue-400 text-[11px] font-bold px-3 py-1 rounded-full border border-blue-800/50 uppercase tracking-tighter">
                      {course.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-800/50 px-2 py-1 rounded-lg">
                      <svg
                        className="w-3.5 h-3.5 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      22h 45m
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-xl line-clamp-2 mb-2 group-hover:text-blue-400 transition duration-300 min-h-[3.5rem] leading-tight flex items-start">
                    {course.title}
                  </h3>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                      {course.lecturer?.name?.charAt(0) || "L"}
                    </div>
                    <p className="text-sm text-slate-400 font-medium">
                      {course.lecturer?.name || "Anonymous Expert"}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-lg items-center gap-1.5">
                      <span className="text-xs font-bold">4.9</span>
                      <div className="flex text-[10px]">★★★★★</div>
                    </div>
                    <span className="text-slate-500 text-xs font-medium">
                      (1.2k reviews)
                    </span>
                  </div>

                  {/* Price Section */}
                  <div className="mt-auto pt-5 border-t border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-extrabold text-2xl text-white">
                        {course.price === 0
                          ? "Free"
                          : `${course.price.toLocaleString("vi-VN")}đ`}
                      </span>
                      {course.price > 0 && (
                        <span className="text-sm text-slate-500 line-through">
                          {(course.price * 1.5).toLocaleString("vi-VN")}đ
                        </span>
                      )}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition duration-300">
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
                        />
                      </svg>
                    </div>
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

export default Courses;
