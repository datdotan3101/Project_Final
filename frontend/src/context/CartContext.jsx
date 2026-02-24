import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Local Toast state
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (course) => {
    const isExist = cartItems.find((item) => item.id === course.id);
    if (isExist) {
      showToast("Khóa học này đã có trong giỏ hàng!", "error");
      return;
    }
    setCartItems([...cartItems, course]);
    showToast("Đã thêm vào giỏ hàng thành công!", "success");
  };

  const removeFromCart = (courseId) => {
    setCartItems(cartItems.filter((item) => item.id !== courseId));
    showToast("Đã xóa khỏi giỏ hàng", "success");
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.length;

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount }}
    >
      {children}
      {/* Custom Toast UI */}
      {toast && (
        <div
          className={`fixed bottom-8 right-8 z-[9999] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 border ${
            toast.type === "success"
              ? "bg-[#1e293b] text-white border-blue-500/30"
              : "bg-[#1e293b] text-white border-red-500/30"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              toast.type === "success"
                ? "bg-blue-600/20 text-blue-400"
                : "bg-red-600/20 text-red-400"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {toast.type === "success" ? "check_circle" : "error"}
            </span>
          </div>
          <span className="font-bold text-sm tracking-wide">
            {toast.message}
          </span>
        </div>
      )}
    </CartContext.Provider>
  );
};
