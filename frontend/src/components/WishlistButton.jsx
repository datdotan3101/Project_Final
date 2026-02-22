import React, { useState, useEffect } from "react";
import axios from "axios";

const WishlistButton = ({ courseId, className = "" }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const response = await axios.get(
          `http://localhost:5000/api/wishlist/check/${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setIsFavorite(response.data.isFavorite);
      } catch (error) {
        console.error("Lỗi kiểm tra wishlist:", error);
      }
    };
    checkStatus();
  }, [courseId]);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để thêm vào danh sách yêu thích!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/wishlist/toggle/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error("Lỗi toggle wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 z-20 ${
        isFavorite
          ? "bg-red-500 text-white shadow-lg shadow-red-500/40 scale-110"
          : "bg-black/40 backdrop-blur-md text-white hover:bg-white hover:text-red-500 border border-white/20"
      } ${className}`}
      title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <svg
          className={`w-5 h-5 transition-transform duration-300 ${isFavorite ? "fill-current" : "fill-none"}`}
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  );
};

export default WishlistButton;
