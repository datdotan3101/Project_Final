import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Wishlist = () => {
  const navigate = useNavigate();
  // Giả lập dữ liệu Wishlist
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 3,
      title: "MBA in a Box: Business Strategy",
      instructor: "365 Careers",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      rating: 4.6,
      reviews: "8,100",
      price: 11.99,
      originalPrice: 79.99,
    },
    {
      id: 4,
      title: "Music Production Masterclass",
      instructor: "Jason Allen",
      image:
        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      reviews: "3,300",
      price: 13.99,
      originalPrice: 69.99,
    },
  ]);

  const handleRemove = (e, id) => {
    e.preventDefault(); // Tránh bị click vào thẻ Link
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
  };

  const handleAddToCart = (e, id) => {
    e.preventDefault();
    alert("Added to cart!");
    navigate("/cart"); // Chuyển sang giỏ hàng sau khi thêm
  };

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-slate-100 font-sans min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111722] px-6 lg:px-10 py-3 shadow-sm">
        <Link
          to="/"
          className="flex items-center gap-4 text-slate-900 dark:text-white"
        >
          <div className="size-8 flex items-center justify-center rounded bg-[#135bec]/20 text-[#135bec]">
            <span className="material-symbols-outlined text-2xl">school</span>
          </div>
          <h2 className="text-lg font-bold hidden sm:block">EduMarket AI</h2>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/cart"
            className="relative text-slate-600 dark:text-slate-300 hover:text-[#135bec]"
          >
            <span className="material-symbols-outlined text-[24px]">
              shopping_cart
            </span>
            <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 rounded-full">
              2
            </span>
          </Link>
          <div
            className="size-9 rounded-full bg-cover bg-center border-2 border-slate-700 cursor-pointer"
            style={{
              backgroundImage:
                "url('https://ui-avatars.com/api/?name=John+Doe&background=135bec&color=fff')",
            }}
          ></div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Banner */}
        <div className="bg-[#1e293b] py-12 px-6 lg:px-10 text-white">
          <div className="max-w-[1440px] mx-auto">
            <h1 className="text-4xl font-bold mb-2">My Wishlist</h1>
            <p className="text-slate-400">
              {wishlistItems.length} courses saved
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-10 py-8">
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistItems.map((course) => (
                <Link
                  to={`/course/${course.id}`}
                  key={course.id}
                  className="group flex flex-col bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-xl hover:border-[#135bec]/50 transition-all"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${course.image}')` }}
                    ></div>
                    {/* Nút Remove (Heart) */}
                    <button
                      onClick={(e) => handleRemove(e, course.id)}
                      className="absolute top-2 right-2 size-8 bg-white/20 hover:bg-white/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors z-10"
                    >
                      <span className="material-symbols-outlined text-white text-lg fill-current text-rose-500">
                        favorite
                      </span>
                    </button>
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight mb-1 line-clamp-2 group-hover:text-[#135bec]">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-2">
                      {course.instructor}
                    </p>

                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-yellow-500 text-sm font-bold">
                        {course.rating}
                      </span>
                      <span className="material-symbols-outlined text-[14px] text-yellow-500 fill-current">
                        star
                      </span>
                      <span className="text-xs text-slate-500">
                        ({course.reviews})
                      </span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                          ${course.price}
                        </span>
                        <span className="text-xs text-slate-500 line-through ml-2">
                          ${course.originalPrice}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(e, course.id)}
                        className="bg-[#135bec] hover:bg-blue-700 text-white p-2 rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-[#135bec]/20"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          add_shopping_cart
                        </span>
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center">
              <span className="material-symbols-outlined text-6xl text-slate-400 mb-4">
                favorite_border
              </span>
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-slate-500">
                Explore courses and click the heart icon to save them for later.
              </p>
              <Link
                to="/"
                className="mt-6 px-6 py-2 bg-[#135bec] text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
              >
                Explore Courses
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b0f17] text-slate-400 border-t border-slate-800 mt-auto py-8">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="size-6 text-[#135bec]">
              <span className="material-symbols-outlined">school</span>
            </div>
            <span className="font-bold text-white">EduMarket AI</span>
          </div>
          <p className="text-sm">© 2024 EduMarket, Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Wishlist;
