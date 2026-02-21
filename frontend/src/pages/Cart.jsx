import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  // Giả lập dữ liệu giỏ hàng
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "2024 Complete Python Bootcamp: From Zero to Hero in Python",
      instructor: "Jose Portilla",
      image:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=200&q=80",
      rating: 4.6,
      reviews: "489,120",
      price: 12.99,
      originalPrice: 84.99,
    },
    {
      id: 2,
      title: "The Ultimate Graphic Design Course",
      instructor: "Lindsay Marsh",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=200&q=80",
      rating: 4.7,
      reviews: "5,200",
      price: 14.99,
      originalPrice: 94.99,
    },
  ]);

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);
  const originalTotal = cartItems.reduce(
    (sum, item) => sum + item.originalPrice,
    0,
  );

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-slate-100 font-sans min-h-screen flex flex-col">
      {/* Header tối giản */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111722] px-6 lg:px-10 py-4 shadow-sm">
        <Link to="/" className="flex items-center gap-3 text-[#135bec]">
          <div className="size-8 flex items-center justify-center rounded bg-[#135bec] text-white">
            <span className="material-symbols-outlined text-xl">school</span>
          </div>
          <h2 className="text-xl font-bold">EduMarket AI</h2>
        </Link>
        <Link
          to="/"
          className="text-sm font-semibold text-slate-500 hover:text-[#135bec] transition-colors"
        >
          Continue Shopping
        </Link>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <p className="font-semibold text-slate-700 dark:text-slate-300 mb-4">
          {cartItems.length} Courses in Cart
        </p>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left Column: Cart Items */}
            <div className="lg:w-3/4 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"
                >
                  <Link to={`/course/${item.id}`} className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full sm:w-32 aspect-video object-cover rounded-lg border border-slate-200 dark:border-slate-600"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/course/${item.id}`}>
                        <h3 className="font-bold text-base leading-tight hover:text-[#135bec] transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-500 mt-1">
                        By {item.instructor}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs">
                        <span className="text-yellow-500 font-bold">
                          {item.rating}
                        </span>
                        <span className="material-symbols-outlined text-[12px] text-yellow-500 fill-current">
                          star
                        </span>
                        <span className="text-slate-400">
                          ({item.reviews} ratings)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row sm:flex-col justify-between items-end sm:items-end mt-4 sm:mt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-700 pt-4 sm:pt-0">
                    <div className="flex gap-4 sm:flex-col text-sm font-medium text-[#135bec]">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="hover:underline text-rose-500"
                      >
                        Remove
                      </button>
                      <button className="hover:underline text-[#135bec]">
                        Move to Wishlist
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#135bec] dark:text-white">
                        ${item.price}
                      </div>
                      <div className="text-xs text-slate-500 line-through">
                        ${item.originalPrice}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Total & Checkout */}
            <div className="lg:w-1/4">
              <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold text-slate-500 mb-2">
                  Total:
                </h3>
                <div className="text-4xl font-black text-slate-900 dark:text-white mb-1">
                  ${total.toFixed(2)}
                </div>
                <div className="text-sm text-slate-500 line-through mb-6">
                  ${originalTotal.toFixed(2)}
                </div>
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-4 bg-[#135bec] hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-[#135bec]/25 transition-all"
                >
                  Checkout
                </button>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold mb-2">Promotions</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Coupon"
                      className="flex-1 bg-slate-50 dark:bg-[#101622] border border-slate-300 dark:border-slate-600 rounded px-3 py-2 text-sm outline-none focus:border-[#135bec]"
                    />
                    <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white text-sm font-bold rounded hover:bg-slate-300 dark:hover:bg-slate-600">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1e293b] p-12 rounded-xl border border-slate-200 dark:border-slate-700 text-center flex flex-col items-center">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">
              shopping_cart
            </span>
            <h2 className="text-xl font-bold mb-2">
              Your cart is empty. Keep shopping to find a course!
            </h2>
            <Link
              to="/"
              className="mt-4 px-8 py-3 bg-[#135bec] text-white font-bold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Keep Shopping
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
