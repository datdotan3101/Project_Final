import React, { createContext, useContext, useState, useEffect } from "react";
import Toast from "../components/Toast";

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
      {toast && <Toast message={toast.message} type={toast.type} />}
    </CartContext.Provider>
  );
};
