import React, { useRef } from "react";
import { Link } from "react-router-dom";
import WishlistButton from "./WishlistButton";

const CourseCarousel = ({ title, courses }) => {
  const scrollRef = useRef(null);

  // Thêm CSS để ẩn thanh cuộn (cho Chrome/Safari)
  const hideScrollbarStyle = {
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    WebkitOverflowScrolling: "touch",
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (courses.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 relative group/carousel">
      {/* CSS Rule to hide scrollbar in Chrome/Safari */}
      <style>
        {`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-3xl font-bold text-white tracking-wide">{title}</h2>
        <Link
          to={`/courses?category=${title.split(" ")[0]}`}
          className="text-blue-500 hover:text-blue-400 font-medium flex items-center gap-1"
        >
          View all{" "}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </Link>
      </div>

      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={() => scroll("left")}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 bg-slate-800/80 hover:bg-blue-600 text-white p-2 rounded-full shadow-xl backdrop-blur-sm opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 border border-slate-700"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={() => scroll("right")}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 bg-slate-800/80 hover:bg-blue-600 text-white p-2 rounded-full shadow-xl backdrop-blur-sm opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 border border-slate-700"
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide snap-x snap-mandatory no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {courses.map((course) => (
            <div
              key={course.id}
              className="min-w-[280px] sm:min-w-[320px] lg:min-w-[300px] snap-start"
            >
              <Link
                to={`/course/${course.id}`}
                className="group bg-[#1e293b] rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/20 transition duration-300 flex flex-col border border-slate-700/50 h-full"
              >
                <div className="h-44 bg-slate-800 relative overflow-hidden">
                  <div className="absolute top-3 left-3 bg-yellow-400 text-black text-[10px] font-extrabold px-2 py-1 rounded uppercase tracking-wider z-10 shadow-lg">
                    Bestseller
                  </div>
                  <WishlistButton courseId={course.id} />
                  {course.thumbnail_url ? (
                    <img
                      src={`http://localhost:5000${course.thumbnail_url}`}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      No Image
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition duration-300"></div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-3 text-xs font-medium text-slate-400">
                    <span className="bg-blue-900/30 text-blue-400 px-2.5 py-1 rounded">
                      {course.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>{" "}
                      22h
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-lg line-clamp-2 mb-1 group-hover:text-blue-400 transition">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-400 mb-3">
                    {course.lecturer?.name || "Ẩn danh"}
                  </p>

                  <div className="flex items-center gap-1.5 mb-4 text-sm">
                    <span className="text-yellow-400 font-bold">4.8</span>
                    <div className="flex text-yellow-400 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span className="text-slate-500 text-xs">(12,400)</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center gap-3">
                    <span className="font-extrabold text-xl text-white">
                      {course.price === 0
                        ? "Free"
                        : `${course.price.toLocaleString("vi-VN")} VNĐ`}
                    </span>
                    {course.price > 0 && (
                      <span className="text-sm text-slate-500 line-through">
                        {(course.price * 1.5).toLocaleString("vi-VN")} VNĐ
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseCarousel;
