import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LecturerDashboard = () => {
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Courses");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null); // Track which course dropdown is open
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, courseId: null });
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".course-action-menu")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/courses/my-courses",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setMyCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  // Calculate actual stats from database data
  const calculateDashboardStats = () => {
    let totalRevenue = 0;
    let totalStudents = 0;
    let totalRatingValue = 0;
    let totalReviewCount = 0;
    let thisMonthRevenue = 0;

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    myCourses.forEach((course) => {
      const enrollmentCount = course.enrollments?.length || 0;
      totalRevenue += (course.price || 0) * enrollmentCount;
      totalStudents += enrollmentCount;

      // Calculate this month revenue
      if (course.enrollments) {
        course.enrollments.forEach((en) => {
          if (new Date(en.purchasedAt) >= firstDayOfMonth) {
            thisMonthRevenue += course.price || 0;
          }
        });
      }

      if (course.reviews && course.reviews.length > 0) {
        course.reviews.forEach((r) => {
          totalRatingValue += r.rating;
          totalReviewCount++;
        });
      }
    });

    const avgRating =
      totalReviewCount > 0
        ? (totalRatingValue / totalReviewCount).toFixed(1)
        : "0.0";

    return {
      totalRevenue: totalRevenue.toLocaleString("vi-VN") + " đ",
      totalStudents: totalStudents.toLocaleString(),
      avgRating,
      totalReviews: totalReviewCount,
      thisMonthRevenue: thisMonthRevenue.toLocaleString("vi-VN") + " đ",
    };
  };

  const handleDeleteClick = (courseId) => {
    setDeleteModal({ isOpen: true, courseId });
  };

  const confirmDeleteCourse = async () => {
    const courseId = deleteModal.courseId;
    if (!courseId) return;

    // Đóng modal trước khi gọi API (hoặc có thể show loading)
    setDeleteModal({ isOpen: false, courseId: null });

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Update local state
      setMyCourses((prev) => prev.filter((course) => course.id !== courseId));
      showToast("Đã xóa khóa học thành công!", "success");
    } catch (err) {
      console.error(err);
      showToast("Lỗi khi xóa khóa học.", "error");
    }
  };

  const cancelDeleteCourse = () => {
    setDeleteModal({ isOpen: false, courseId: null });
  };

  const dashboardStats = calculateDashboardStats();

  const stats = [
    {
      label: "TOTAL REVENUE",
      value: dashboardStats.totalRevenue,
      trend: "+0%",
      trendUp: true,
      icon: (
        <svg
          className="w-5 h-5 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "TOTAL STUDENTS",
      value: dashboardStats.totalStudents,
      trend: "+0%",
      trendUp: true,
      icon: (
        <svg
          className="w-5 h-5 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      label: "INSTRUCTOR RATING",
      value: dashboardStats.avgRating,
      trend: "+0.0",
      trendUp: true,
      sublabel: `${dashboardStats.totalReviews} total reviews`,
      icon: (
        <svg
          className="w-5 h-5 text-yellow-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.837-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-[#0b1120] min-h-screen text-slate-300 font-sans pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
              Instructor Dashboard
            </h1>
            <p className="text-slate-400">
              Manage your courses, track performance, and engage with students.
            </p>
          </div>
          <button
            onClick={() => navigate("/lecturer/course/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 shadow-lg shadow-blue-600/20 w-fit"
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
                strokeWidth="2.5"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Course
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-[#1e293b] border border-slate-700/50 p-6 rounded-2xl shadow-xl relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-500 tracking-wider uppercase">
                  {stat.label}
                </span>
                <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition">
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-white tracking-tight">
                  {stat.value}
                </span>
                <span
                  className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${stat.trendUp ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}
                >
                  {stat.trendUp ? "↗" : "↘"} {stat.trend}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2 font-medium">
                {stat.sublabel || "vs. last month"}
              </p>
              {/* Subtle background glow */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-600/5 blur-3xl rounded-full"></div>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition"
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
            </div>
            <input
              type="text"
              placeholder="Search your courses"
              className="block w-full bg-[#1e293b] border border-slate-700 text-white text-sm rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#1e293b] border border-slate-700 hover:border-slate-600 text-white font-bold py-3 px-6 rounded-xl text-sm transition transition-all group">
              <svg
                className="w-4 h-4 text-slate-400 group-hover:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#1e293b] border border-slate-700 hover:border-slate-600 text-white font-bold py-3 px-6 rounded-xl text-sm transition transition-all group">
              <svg
                className="w-4 h-4 text-slate-400 group-hover:text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              Sort by
            </button>
          </div>
        </div>

        {/* Courses List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold animate-pulse">
              Loading your courses...
            </p>
          </div>
        ) : myCourses.length === 0 ? (
          <div className="bg-[#1e293b] p-16 rounded-3xl text-center border border-slate-700/50 shadow-2xl">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              You haven't created any courses yet.
            </h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto tracking-tight">
              Ready to share your knowledge with the world? Click the button
              below to start your journey.
            </p>
            <button
              onClick={() => navigate("/lecturer/course/new")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-600/20"
            >
              Create your first course
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {myCourses
              .filter((c) =>
                c.title.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
              .map((course) => {
                const enrollmentCount = course.enrollments?.length || 0;
                const ratings = course.reviews || [];
                const avgRating =
                  ratings.length > 0
                    ? (
                        ratings.reduce((acc, r) => acc + r.rating, 0) /
                        ratings.length
                      ).toFixed(1)
                    : "0.0";

                // Calculate revenue for this course
                const courseRevenue = (course.price || 0) * enrollmentCount;

                // Calculate this month revenue for this course
                const firstDayOfMonth = new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  1,
                );
                const thisMonthRevenue = (course.enrollments || [])
                  .filter((en) => new Date(en.purchasedAt) >= firstDayOfMonth)
                  .reduce((acc, en) => acc + (course.price || 0), 0);

                return (
                  <div
                    key={course.id}
                    className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-5 hover:border-slate-500 transition-all group flex flex-col md:flex-row gap-6 relative overflow-hidden"
                  >
                    {/* Thumbnail */}
                    <div className="w-full md:w-56 h-32 bg-slate-800 rounded-xl overflow-hidden shrink-0 relative border border-slate-700">
                      <img
                        src={
                          course.thumbnail_url
                            ? `http://localhost:5000${course.thumbnail_url}`
                            : "https://via.placeholder.com/400x225?text=Course+Thumbnail"
                        }
                        alt="thumbnail"
                        className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-2 left-2">
                        <span
                          className={`text-[10px] font-black px-2 py-1 rounded-md shadow-lg ${
                            course.status === "APPROVED"
                              ? "bg-green-500 text-white"
                              : course.status === "PENDING"
                                ? "bg-yellow-500 text-black"
                                : "bg-red-500 text-white"
                          }`}
                        >
                          {course.status === "APPROVED"
                            ? "PUBLISHED"
                            : course.status === "PENDING"
                              ? "PENDING"
                              : "REJECTED"}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <h3 className="text-lg font-extrabold text-white group-hover:text-blue-400 transition leading-tight">
                            {course.title}
                          </h3>
                          <div className="flex items-center gap-2 relative course-action-menu">
                            <button
                              onClick={() => setActiveDropdown(activeDropdown === course.id ? null : course.id)}
                              className="p-2 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition"
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
                                  d="M12 5h.01M12 12h.01M12 19h.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                />
                              </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {activeDropdown === course.id && (
                              <div className="absolute right-0 top-12 w-48 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl py-2 z-50 overflow-hidden">
                                <button
                                  onClick={() => {
                                    setActiveDropdown(null);
                                    navigate(`/lecturer/course/edit/${course.id}`);
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 transition flex items-center gap-3"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                  Edit Course
                                </button>

                                {course.status === "PENDING" && (
                                  <>
                                    <div className="h-px bg-slate-700/50 my-1"></div>
                                    <button
                                      onClick={() => {
                                        setActiveDropdown(null);
                                        handleDeleteClick(course.id);
                                      }}
                                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition flex items-center gap-3"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                      Delete Course
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 mt-2 line-clamp-1 max-w-2xl">
                          {course.description || "No description available."}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Enrolled
                          </span>
                          <span className="text-sm font-bold text-white uppercase">
                            {enrollmentCount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Lessons
                          </span>
                          <span className="text-sm font-bold text-white uppercase">
                            {course.sections?.reduce(
                              (acc, s) => acc + (s.lessons?.length || 0),
                              0,
                            ) || 0}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Rating
                          </span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-white">
                              {avgRating}
                            </span>
                            <span className="text-yellow-400">★</span>
                            <span className="text-[10px] text-slate-600 font-medium">
                              ({ratings.length})
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            This Month
                          </span>
                          <span className="text-sm font-bold text-white">
                            {thisMonthRevenue.toLocaleString("vi-VN")} đ
                          </span>
                        </div>
                        <div className="flex items-center justify-end gap-4">
                         
                          <button
                            onClick={() =>
                              navigate(`/lecturer/course/edit/${course.id}`)
                            }
                            className="text-blue-400 hover:text-blue-300 text-xs font-black uppercase tracking-widest flex items-center gap-2 group/btn"
                          >
                            Manage Course
                            <svg
                              className="w-4 h-4 transition-transform group-hover/btn:translate-x-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2.5"
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Decorative glow */}
                    <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Pagination */}
        {myCourses.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase())).length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`w-10 h-10 border border-slate-700 rounded-lg flex items-center justify-center transition ${currentPage === 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {Array.from({ length: Math.ceil(myCourses.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase())).length / itemsPerPage) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition ${currentPage === idx + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'border border-slate-700 text-slate-400 hover:bg-slate-800'}`}
              >
                {idx + 1}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(myCourses.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase())).length / itemsPerPage), p + 1))}
              disabled={currentPage === Math.ceil(myCourses.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase())).length / itemsPerPage)}
              className={`w-10 h-10 border border-slate-700 rounded-lg flex items-center justify-center transition ${currentPage === Math.ceil(myCourses.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase())).length / itemsPerPage) ? 'text-slate-600 cursor-not-allowed' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Custom Toast UI */}
      {toast && (
        <div
          className={`fixed bottom-8 right-8 z-[9999] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 border ${
            toast.type === "success"
              ? "bg-[#1e293b] text-white border-green-500/30"
              : "bg-[#1e293b] text-white border-red-500/30"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              toast.type === "success"
                ? "bg-green-600/20 text-green-400"
                : "bg-red-600/20 text-red-400"
            }`}
          >
            {toast.type === "success" ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <span className="font-bold text-sm tracking-wide">
            {toast.message}
          </span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={cancelDeleteCourse}
          ></div>
          <div className="relative bg-[#1e293b] border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Xác nhận xóa khóa học</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Bạn có chắc chắn muốn xóa khóa học này không? Hành động này sẽ
                xóa vĩnh viễn khóa học và không thể hoàn tác.
              </p>
            </div>
            <div className="bg-slate-800/50 px-6 py-4 flex gap-3 justify-end items-center">
              <button
                onClick={cancelDeleteCourse}
                className="px-5 py-2.5 text-sm font-bold text-slate-300 hover:text-white hover:bg-slate-700 rounded-xl transition-all"
              >
                Hủy
              </button>
              <button
                onClick={confirmDeleteCourse}
                className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all shadow-lg shadow-red-600/20"
              >
                Xóa Khóa Học
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerDashboard;
