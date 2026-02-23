import React, { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isInstructorMode = location.pathname.startsWith("/lecturer");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 400); // 400ms delay to allow moving mouse into the dropdown
  };

  return (
    <nav className="bg-[#0b1120] border-b border-slate-800 sticky top-0 z-50 h-16 flex items-center shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-center h-full">
          {/* Left: Logo & Nav Links */}
          <div className="flex items-center gap-8 lg:gap-12">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-7 h-7 bg-blue-600 rounded-sm transform rotate-45 group-hover:rotate-90 transition-transform duration-300"></div>
              <span className="text-white font-extrabold text-xl tracking-tight hidden sm:block">
                EduMarket
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-300">
              <Link to="/courses" className="hover:text-white transition">
                Explore
              </Link>
              <Link to="/my-learning" className="hover:text-white transition">
                My Learning
              </Link>
              <Link
                to={
                  user?.role === "LECTURER" || user?.role === "ADMIN"
                    ? "/lecturer/dashboard"
                    : "/become-lecturer"
                }
                className="hover:text-white transition"
              >
                Teach on Platform
              </Link>
            </div>
          </div>

          {/* Right: Search, Cart, Noti, Profile */}
          <div className="flex items-center gap-5 lg:gap-7 text-slate-300">
            {/* Search Icon */}
            <button className="hover:text-white transition p-1">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="hover:text-white transition p-1 relative"
            >
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-blue-600 rounded-full border border-[#0b1120]"></span>
            </Link>

            {/* Notification Icon */}
            <button className="hover:text-white transition p-1">
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            {/* Auth Buttons or Profile Avatar */}
            {!user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-bold hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-bold bg-white text-black px-4 py-2 rounded border border-transparent hover:bg-slate-200 transition"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div
                className="relative group h-16 flex items-center"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-8 h-8 rounded-full border-2 border-blue-600 p-0.5 cursor-pointer overflow-hidden transition transform hover:scale-105">
                  <img
                    src={
                      user.avatar_url ||
                      "https://ui-avatars.com/api/?name=" + user.name
                    }
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>

                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 top-16 w-64 bg-[#1e293b] border border-slate-700 rounded-lg shadow-2xl transition-all duration-300 transform origin-top-right z-[100] ${
                    isDropdownOpen
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }`}
                >
                  {/* User Info */}
                  <div className="p-4 border-b border-slate-700 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-blue-600 p-0.5 overflow-hidden">
                      <img
                        src={
                          user.avatar_url ||
                          "https://ui-avatars.com/api/?name=" + user.name
                        }
                        alt="avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-white font-bold truncate">
                        {user.name}
                      </span>
                      <span className="text-slate-400 text-xs truncate">
                        {user.email || "student@example.com"}
                      </span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2 flex flex-col gap-1">
                    <Link
                      to="/my-learning"
                      className="flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-md transition group/item"
                    >
                      <svg
                        className="w-5 h-5 text-slate-400 group-hover/item:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                      <span className="font-semibold text-sm">My Learning</span>
                    </Link>

                    <Link
                      to="/wishlist"
                      className="flex items-center gap-3 p-3 text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-md transition group/item"
                    >
                      <svg
                        className="w-5 h-5 text-slate-400 group-hover/item:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span className="font-semibold text-sm">Wishlist</span>
                    </Link>

                    <Link
                      to={
                        user.role === "LECTURER" || user.role === "ADMIN"
                          ? isInstructorMode
                            ? "/"
                            : "/lecturer/dashboard"
                          : "/become-lecturer"
                      }
                      className="flex items-center justify-between p-3 text-slate-300 hover:bg-slate-700/50 hover:text-white rounded-md transition group/item cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <svg
                          className="w-5 h-5 text-slate-400 group-hover/item:text-blue-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                        <span className="font-semibold text-sm">
                          Instructor Mode
                        </span>
                      </div>
                      <div
                        className={`w-10 h-5 rounded-full relative transition flex items-center px-1 ${
                          isInstructorMode ? "bg-blue-600" : "bg-slate-600"
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                            isInstructorMode
                              ? "translate-x-[18px]"
                              : "translate-x-0"
                          }`}
                        ></div>
                      </div>
                    </Link>
                  </div>

                  {/* Logout Row */}
                  <div className="p-2 border-t border-slate-700">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded-md transition group/item"
                    >
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
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      <span className="font-bold text-sm">Log out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
