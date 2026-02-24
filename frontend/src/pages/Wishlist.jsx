import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Wishlist = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

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
      <div className="bg-[#0b1120] min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b1120] min-h-screen text-slate-300 font-sans pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-white tracking-tight">
              My Wishlist
            </h1>
            <div className="flex items-center gap-2 text-slate-400 font-bold">
              <span>You have</span>
              <span className="text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-md">
                {courses.length} courses
              </span>
              <span>saved for later.</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1c2431] border border-slate-700/50 rounded-xl text-sm font-bold hover:bg-slate-700 transition">
              <span className="material-symbols-outlined text-[18px]">
                filter_list
              </span>
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1c2431] border border-slate-700/50 rounded-xl text-sm font-bold hover:bg-slate-700 transition">
              <span className="material-symbols-outlined text-[18px]">
                sort
              </span>
              Recently Added
            </button>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="bg-[#1c2431]/50 border border-slate-700/30 rounded-[2.5rem] p-20 text-center shadow-2xl backdrop-blur-sm">
            <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
              <span className="material-symbols-outlined text-5xl text-blue-500">
                favorite
              </span>
            </div>
            <h2 className="text-3xl font-black text-white mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium">
              Browse our catalog of thousands of courses and find the perfect
              one for your journey!
            </p>
            <Link
              to="/courses"
              className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-12 rounded-2xl transition-all duration-300 shadow-xl shadow-blue-600/20 active:scale-95 group"
            >
              Explore Courses
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group bg-[#1c2431] rounded-[2rem] overflow-hidden hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-500 flex flex-col border border-slate-700/50 relative h-full active:scale-[0.98]"
              >
                {/* Wishlist Button (Remove) */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveFromWishlist(course.id);
                  }}
                  className="absolute top-5 right-5 z-20 w-10 h-10 bg-[#0b1120]/60 backdrop-blur-md rounded-full flex items-center justify-center text-blue-500 border border-white/10 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg"
                  title="Remove from wishlist"
                >
                  <span className="material-symbols-outlined font-black text-[22px] filled">
                    favorite
                  </span>
                </button>

                {/* Thumbnail */}
                <Link
                  to={`/course/${course.id}`}
                  className="block relative overflow-hidden aspect-[16/10]"
                >
                  <img
                    src={
                      course.thumbnail_url?.startsWith("http")
                        ? course.thumbnail_url
                        : `http://localhost:5000${course.thumbnail_url}`
                    }
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1120]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {course.price === 0 && (
                    <span className="absolute bottom-4 left-4 bg-green-500 text-white text-[10px] font-black px-2.5 py-1 rounded-[6px] uppercase tracking-wider shadow-lg">
                      Free
                    </span>
                  )}
                  {course.rating >= 4.8 && (
                    <span className="absolute bottom-4 left-4 bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-[6px] uppercase tracking-wider shadow-lg">
                      BESTSELLER
                    </span>
                  )}
                </Link>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex-grow">
                    <Link to={`/course/${course.id}`}>
                      <h3 className="font-black text-white text-lg line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors leading-tight">
                        {course.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-slate-500 font-bold mb-3 uppercase tracking-wide">
                      {course.lecturer?.name || "Instructor Name"}
                    </p>

                    <div className="flex items-center gap-1.5 mb-4">
                      <span className="text-orange-400 font-bold text-sm tracking-tight">
                        {course.rating || 4.8}
                      </span>
                      <div className="flex text-orange-400 text-[10px] tracking-tighter">
                        ★★★★★
                      </div>
                      <span className="text-slate-500 text-[10px] font-semibold">
                        ({(course.reviewsCount || 12000).toLocaleString()})
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                      <span className="font-black text-2xl text-white">
                        {course.price === 0
                          ? "Free"
                          : `${course.price.toLocaleString("vi-VN")}đ`}
                      </span>
                      {course.price > 0 && (
                        <span className="text-sm text-slate-500 line-through font-bold">
                          {(course.price * 1.5).toLocaleString("vi-VN")}đ
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(course);
                    }}
                    className="w-full py-4 bg-blue-600/10 text-blue-500 group-hover:bg-blue-600 group-hover:text-white rounded-2xl font-black text-sm transition-all duration-300 flex items-center justify-center gap-3 border border-blue-500/20 group-hover:border-blue-600 shadow-lg group-hover:shadow-blue-600/30 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      shopping_cart
                    </span>
                    Add to Cart
                  </button>
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
