import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { user } = useAuth();
  const { cartItems, removeFromCart, cartCount } = useCart();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");

  // State quản lý việc chọn các khóa học để thanh toán - Mặc định là rỗng
  const [selectedItems, setSelectedItems] = useState([]);

  // Bỏ hiệu ứng mặc định chọn tất cả khi giỏ hàng thay đổi
  // Chỉ cập nhật nếu giỏ hàng trống thì reset selectedItems
  useEffect(() => {
    if (cartItems.length === 0) {
      setSelectedItems([]);
    }
  }, [cartItems.length]);

  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  // Tính toán dựa trên các items được chọn
  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(item.id),
  );

  const originalTotal = selectedCartItems.reduce(
    (acc, item) => acc + (item.originalPrice || item.price * 1.5 || item.price),
    0,
  );
  const discountedTotal = selectedCartItems.reduce(
    (acc, item) => acc + item.price,
    0,
  );
  const appliedDiscounts = originalTotal - discountedTotal;

  return (
    <div className="bg-[#0b1120] min-h-screen text-slate-300 font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-white mb-2">
              Shopping Cart
            </h1>
            <p className="text-slate-400 font-bold">
              {cartCount} Courses in Cart
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={toggleSelectAll}
              className="text-blue-500 hover:text-blue-400 font-bold text-sm flex items-center gap-2"
            >
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition ${selectedItems.length === cartItems.length ? "bg-blue-600 border-blue-600" : "border-slate-600"}`}
              >
                {selectedItems.length === cartItems.length && (
                  <span className="material-symbols-outlined text-[16px] text-white">
                    check
                  </span>
                )}
              </div>
              {selectedItems.length === cartItems.length
                ? "Deselect All"
                : "Select All"}
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* List of Courses */}
          <div className="flex-1 space-y-6">
            {cartItems.length === 0 ? (
              <div className="bg-[#1c2431] border border-slate-700/50 rounded-2xl p-12 text-center shadow-2xl">
                <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">
                  shopping_cart
                </span>
                <h2 className="text-xl font-bold text-white mb-2">
                  Your cart is empty
                </h2>
                <p className="text-slate-400 mb-6">
                  Explore our courses and find something new to learn!
                </p>
                <Link
                  to="/courses"
                  className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition shadow-lg shadow-blue-600/20"
                >
                  Browse Courses
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`bg-[#1c2431] border rounded-2xl p-6 flex flex-col sm:flex-row gap-6 transition-all duration-300 group overflow-hidden shadow-2xl relative ${selectedItems.includes(item.id) ? "border-blue-500/50 bg-[#1e293b]" : "border-slate-700/50"}`}
                >
                  <div className="w-full sm:w-48 aspect-video overflow-hidden rounded-xl bg-slate-800 shrink-0">
                    <img
                      src={
                        item.thumbnail_url?.startsWith("http")
                          ? item.thumbnail_url
                          : `http://localhost:5000${item.thumbnail_url}`
                      }
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <Link to={`/course/${item.id}`}>
                          <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition leading-tight line-clamp-2">
                            {item.title}
                          </h2>
                        </Link>
                        <div className="text-right shrink-0 ml-4">
                          <div className="text-xl font-black text-blue-400">
                            {item.price === 0
                              ? "Free"
                              : `${item.price.toLocaleString("vi-VN")}đ`}
                          </div>
                          {item.price > 0 && (
                            <div className="text-sm text-slate-500 line-through">
                              {(
                                item.originalPrice || item.price * 1.5
                              ).toLocaleString("vi-VN")}
                              đ
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 mb-2 font-medium">
                        By {item.lecturer?.name || "Instructor"}
                      </p>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-orange-400 font-bold text-sm">
                          {item.rating || 4.8}
                        </span>
                        <div className="flex text-orange-400 text-xs text-[10px]">
                          ★★★★★
                        </div>
                        <span className="text-slate-500 text-[11px]">
                          ({(item.reviewsCount || 1200).toLocaleString()}{" "}
                          reviews)
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-6 mt-4">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex items-center gap-2 text-slate-500 text-[11px] font-bold hover:text-red-400 transition uppercase tracking-widest"
                      >
                        <span className="material-symbols-outlined text-sm">
                          delete
                        </span>
                        REMOVE
                      </button>
                      <button className="flex items-center gap-2 text-slate-500 text-[11px] font-bold hover:text-blue-400 transition uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">
                          favorite
                        </span>
                        SAVE FOR LATER
                      </button>
                    </div>
                  </div>

                  {/* Checkbox Select - MOVED TO RIGHT */}
                  <div className="flex items-center sm:pl-4 border-l border-slate-700/30 sm:ml-2">
                    <button
                      onClick={() => toggleSelectItem(item.id)}
                      className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${selectedItems.includes(item.id) ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/40 scale-110" : "border-slate-600 hover:border-blue-500/50"}`}
                      title={
                        selectedItems.includes(item.id)
                          ? "Deselect item"
                          : "Select item"
                      }
                    >
                      {selectedItems.includes(item.id) && (
                        <span className="material-symbols-outlined text-[18px] text-white font-black animate-in zoom-in duration-200">
                          check
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Sidebar */}
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-[#1c2431] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden sticky top-24 p-8">
              <h2 className="text-2xl font-black text-white mb-8">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-500">Selected Items</span>
                  <span className="text-white font-bold">
                    {selectedItems.length} courses
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-500">Original Price</span>
                  <span className="text-white font-bold">
                    {originalTotal.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-slate-500">Applied Discounts</span>
                  <span className="text-green-500 font-bold">
                    -{appliedDiscounts.toLocaleString("vi-VN")}đ
                  </span>
                </div>

                <div className="h-px bg-slate-800 my-4"></div>

                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xl font-bold text-white">Total:</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                      VAT Included where applicable
                    </div>
                  </div>
                  <div className="text-3xl font-black text-white tracking-tight">
                    {discountedTotal.toLocaleString("vi-VN")}đ
                  </div>
                </div>

                <button
                  disabled={selectedItems.length === 0}
                  onClick={() =>
                    navigate(`/checkout/multiple`, {
                      state: { selectedCourseIds: selectedItems },
                    })
                  }
                  className="w-full mt-8 py-5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-lg rounded-2xl transition-all duration-300 shadow-xl shadow-blue-600/30 active:scale-[0.98] flex items-center justify-center gap-3 group"
                >
                  Checkout ({selectedItems.length})
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </button>

                <div className="text-center mt-4">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    30-Day Money-Back Guarantee
                  </span>
                </div>

                <div className="h-px bg-slate-800 my-8"></div>

                {/* Promo Code */}
                <div className="relative group">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                        sell
                      </span>
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Promo Code"
                        className="w-full bg-[#111827] border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-700 font-medium"
                      />
                    </div>
                    <button className="text-blue-500 hover:text-blue-400 font-bold text-sm px-2 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
