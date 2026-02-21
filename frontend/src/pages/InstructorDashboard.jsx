import React, { useState } from "react";
import { Link } from "react-router-dom";

const InstructorDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  // State cho danh sách khóa học
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "2024 Complete Python Bootcamp: From Zero to Hero",
      image:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=200&q=80",
      status: "Published",
      price: "$12.99",
      students: 850,
      revenue: "$11,041.50",
    },
    {
      id: 2,
      title: "Advanced React.js & Redux Toolkit",
      image:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=200&q=80",
      status: "Published",
      price: "$14.99",
      students: 320,
      revenue: "$4,796.80",
    },
    {
      id: 3,
      title: "Mastering UI/UX Design with Figma",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=200&q=80",
      status: "Draft",
      price: "$19.99",
      students: 0,
      revenue: "$0.00",
    },
  ]);

  // THÊM: State để quản lý Modal Xóa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  // Hàm khi bấm vào icon thùng rác (Mở modal thay vì xóa luôn)
  const handleDeleteClick = (course) => {
    setCourseToDelete(course); // Lưu khóa học đang chọn
    setIsModalOpen(true); // Mở modal
  };

  // Hàm thực thi việc xóa (Khi bấm nút Delete trong Modal)
  const confirmDelete = () => {
    if (courseToDelete) {
      // TODO: Gọi API: axios.delete(`/api/courses/${courseToDelete.id}`)

      const updatedCourses = courses.filter(
        (course) => course.id !== courseToDelete.id,
      );
      setCourses(updatedCourses);

      // Đóng modal & reset data
      setIsModalOpen(false);
      setCourseToDelete(null);
    }
  };

  // Hàm hủy xóa (Đóng modal)
  const cancelDelete = () => {
    setIsModalOpen(false);
    setCourseToDelete(null);
  };

  const stats = [
    {
      id: 1,
      title: "Total Revenue",
      value: "$4,523.00",
      icon: "payments",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      id: 2,
      title: "Total Students",
      value: "1,248",
      icon: "groups",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      id: 3,
      title: "Average Rating",
      value: "4.7",
      icon: "star",
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      id: 4,
      title: "Active Courses",
      value: "5",
      icon: "play_circle",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-slate-100 font-sans min-h-screen flex overflow-hidden">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-[#111722] border-r border-slate-200 dark:border-slate-800 z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-3 text-[#135bec]">
            <div className="size-8 flex items-center justify-center rounded bg-[#135bec] text-white">
              <span className="material-symbols-outlined text-xl">school</span>
            </div>
            <h2 className="text-xl font-bold">EduMarket</h2>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
          <p className="px-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Instructor
          </p>

          <button
            onClick={() => setActiveMenu("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeMenu === "dashboard" ? "bg-[#135bec] text-white shadow-lg shadow-[#135bec]/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"}`}
          >
            <span className="material-symbols-outlined text-[20px]">
              dashboard
            </span>
            <span className="font-semibold text-sm">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveMenu("courses")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeMenu === "courses" ? "bg-[#135bec] text-white shadow-lg shadow-[#135bec]/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"}`}
          >
            <span className="material-symbols-outlined text-[20px]">
              video_library
            </span>
            <span className="font-semibold text-sm">My Courses</span>
          </button>

          <button
            onClick={() => setActiveMenu("students")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeMenu === "students" ? "bg-[#135bec] text-white shadow-lg shadow-[#135bec]/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"}`}
          >
            <span className="material-symbols-outlined text-[20px]">
              groups
            </span>
            <span className="font-semibold text-sm">Students</span>
          </button>

          <button
            onClick={() => setActiveMenu("earnings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeMenu === "earnings" ? "bg-[#135bec] text-white shadow-lg shadow-[#135bec]/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"}`}
          >
            <span className="material-symbols-outlined text-[20px]">
              account_balance_wallet
            </span>
            <span className="font-semibold text-sm">Earnings</span>
          </button>

          <button
            onClick={() => setActiveMenu("qa")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeMenu === "qa" ? "bg-[#135bec] text-white shadow-lg shadow-[#135bec]/20" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"}`}
          >
            <span className="material-symbols-outlined text-[20px]">forum</span>
            <span className="font-semibold text-sm">Q&A</span>
            <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              3
            </span>
          </button>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">
              logout
            </span>
            <span className="font-semibold text-sm">Exit to Student</span>
          </Link>
        </div>
      </aside>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-[#111722] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 lg:px-10 z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500 hover:text-[#135bec]">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="text-xl font-bold capitalize">
              {activeMenu.replace("-", " ")}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/instructor/course/create"
              className="hidden sm:flex items-center gap-2 bg-[#135bec] hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-[#135bec]/20"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Course
            </Link>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block"></div>
            <button className="text-slate-500 hover:text-[#135bec] transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-0 right-0 size-2 bg-rose-500 rounded-full"></span>
            </button>
            <div
              className="size-9 rounded-full bg-cover bg-center border-2 border-slate-200 dark:border-slate-700 cursor-pointer"
              style={{
                backgroundImage:
                  "url('https://ui-avatars.com/api/?name=Instructor&background=135bec&color=fff')",
              }}
            ></div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar relative">
          <div className="max-w-[1200px] mx-auto space-y-8">
            {activeMenu === "dashboard" && (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat) => (
                    <div
                      key={stat.id}
                      className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4"
                    >
                      <div
                        className={`size-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}
                      >
                        <span className="material-symbols-outlined text-2xl">
                          {stat.icon}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 font-medium mb-1">
                          {stat.title}
                        </p>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                          {stat.value}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Phần Quản lý khóa học (Recent Courses) */}
                <div className="bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Your Courses
                    </h2>
                    <div className="flex gap-2">
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
                          search
                        </span>
                        <input
                          type="text"
                          placeholder="Search courses..."
                          className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-[#101622] border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#135bec]/50 w-full sm:w-64"
                        />
                      </div>
                    </div>
                  </div>

                  {courses.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-[#151e2e] text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200 dark:border-slate-800">
                            <th className="p-4 font-semibold">Course</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Price</th>
                            <th className="p-4 font-semibold">Students</th>
                            <th className="p-4 font-semibold">Revenue</th>
                            <th className="p-4 font-semibold text-right">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                          {courses.map((course) => (
                            <tr
                              key={course.id}
                              className="hover:bg-slate-50 dark:hover:bg-[#151e2e]/50 transition-colors group"
                            >
                              <td className="p-4">
                                <div className="flex items-center gap-4">
                                  <img
                                    src={course.image}
                                    alt={course.title}
                                    className="w-20 aspect-video object-cover rounded border border-slate-200 dark:border-slate-700"
                                  />
                                  <span className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 max-w-[250px] group-hover:text-[#135bec] transition-colors cursor-pointer">
                                    {course.title}
                                  </span>
                                </div>
                              </td>
                              <td className="p-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    course.status === "Published"
                                      ? "bg-emerald-500/10 text-emerald-500"
                                      : "bg-slate-500/10 text-slate-500"
                                  }`}
                                >
                                  {course.status}
                                </span>
                              </td>
                              <td className="p-4 text-sm font-medium">
                                {course.price}
                              </td>
                              <td className="p-4 text-sm">{course.students}</td>
                              <td className="p-4 text-sm font-bold text-[#135bec] dark:text-blue-400">
                                {course.revenue}
                              </td>
                              <td className="p-4 text-right whitespace-nowrap">
                                <Link
                                  to={`/instructor/course/edit/${course.id}`}
                                  className="text-slate-400 hover:text-[#135bec] transition-colors p-2 inline-block"
                                >
                                  <span className="material-symbols-outlined text-[20px]">
                                    edit_square
                                  </span>
                                </Link>

                                {/* NÚT MỞ MODAL XÓA */}
                                <button
                                  onClick={() => handleDeleteClick(course)}
                                  className="text-slate-400 hover:text-rose-500 transition-colors p-2 inline-block"
                                >
                                  <span className="material-symbols-outlined text-[20px]">
                                    delete
                                  </span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-12 text-center flex flex-col items-center">
                      <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600 mb-4">
                        video_file
                      </span>
                      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">
                        No courses available
                      </h3>
                      <p className="text-slate-500 mt-1 mb-6 text-sm">
                        You haven't created any courses yet, or you have deleted
                        all of them.
                      </p>
                      <Link
                        to="/instructor/course/create"
                        className="bg-[#135bec] hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-[#135bec]/20"
                      >
                        Create Your First Course
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeMenu !== "dashboard" && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 animate-fade-in">
                <span className="material-symbols-outlined text-6xl mb-4 opacity-50">
                  construction
                </span>
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">
                  Feature Under Construction
                </h2>
                <p className="mt-2">
                  The {activeMenu.replace("-", " ")} module is currently being
                  built.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* CUSTOM CONFIRMATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          {/* Lớp nền mờ */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={cancelDelete} // Bấm ra ngoài cũng đóng modal
          ></div>

          {/* Hộp thoại Modal */}
          <div className="relative bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden transform scale-100 transition-transform">
            <div className="flex items-start gap-4 mb-6">
              <div className="size-12 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center flex-shrink-0 text-rose-500">
                <span className="material-symbols-outlined text-2xl">
                  warning
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Delete Course?
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="font-bold text-slate-900 dark:text-slate-200">
                    "{courseToDelete?.title}"
                  </span>
                  ? This action cannot be undone and will permanently remove all
                  related materials and student data.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-5 py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/20"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
        .animate-fade-in { animation: fadeIn 0.2s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default InstructorDashboard;
