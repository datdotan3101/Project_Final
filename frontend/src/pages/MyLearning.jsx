import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

const MyLearning = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Dữ liệu mô phỏng (Sau này mapping với dữ liệu từ getMyLearning controller)
  const purchasedCourses = [
    {
      id: 1,
      title: "2024 Complete Python Bootcamp: From Zero to Hero in Python",
      image:
        "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=600&q=80",
      instructor: "Jose Portilla",
      progress: 35,
      lastAccessed: "2 days ago",
    },
    {
      id: 2,
      title: "The Ultimate Graphic Design Course",
      image:
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80",
      instructor: "Lindsay Marsh",
      progress: 0,
      lastAccessed: "Just now",
    },
    {
      id: 3,
      title: "Complete Web Development Bootcamp 2024",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
      instructor: "Dr. Angela Yu",
      progress: 100,
      lastAccessed: "1 month ago",
    },
  ];

  // Tối ưu: Dùng useMemo để lọc danh sách, tránh lọc lại khi render không cần thiết
  const filteredCourses = useMemo(() => {
    return purchasedCourses.filter((course) => {
      if (activeTab === "progress")
        return course.progress > 0 && course.progress < 100;
      if (activeTab === "completed") return course.progress === 100;
      return true;
    });
  }, [activeTab]);

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-slate-100 font-sans min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111722] px-6 lg:px-10 py-3 shadow-sm">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-4 text-slate-900 dark:text-white"
          >
            <div className="size-8 flex items-center justify-center rounded bg-[#135bec]/20 text-[#135bec]">
              <span className="material-symbols-outlined text-2xl">school</span>
            </div>
            <h2 className="text-lg font-bold hidden sm:block">EduMarket AI</h2>
          </Link>
          <label className="hidden md:flex flex-col w-[400px]">
            <div className="flex w-full items-stretch rounded-full h-10 border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#1e293b] overflow-hidden focus-within:ring-2 focus-within:ring-[#135bec]/50">
              <div className="text-slate-400 flex items-center justify-center pl-4">
                <span className="material-symbols-outlined text-xl">
                  search
                </span>
              </div>
              <input
                className="w-full bg-transparent border-none focus:ring-0 px-4 text-sm"
                placeholder="Search your courses"
              />
            </div>
          </label>
        </div>
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="hidden lg:block text-slate-600 dark:text-slate-300 hover:text-[#135bec] text-sm font-medium"
          >
            Explore Courses
          </Link>
          <div
            className="size-9 rounded-full bg-cover bg-center border-2 border-slate-700"
            style={{
              backgroundImage:
                "url('https://ui-avatars.com/api/?name=John+Doe&background=135bec&color=fff')",
            }}
          ></div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="bg-[#1e293b] py-12 px-6 lg:px-10 text-white">
          <div className="max-w-[1440px] mx-auto">
            <h1 className="text-4xl font-bold mb-6">My Learning</h1>
            <div className="flex items-center gap-6 text-sm font-bold border-b border-slate-700">
              {["all", "progress", "completed"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 capitalize transition-colors ${activeTab === tab ? "text-[#135bec] border-b-2 border-[#135bec]" : "text-slate-400 hover:text-white"}`}
                >
                  {tab === "all"
                    ? "All Courses"
                    : tab === "progress"
                      ? "In Progress"
                      : "Completed"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-10 py-8">
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <Link
                  to={`/learn/${course.id}`}
                  key={course.id}
                  className="group flex flex-col bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden hover:shadow-xl hover:border-[#135bec]/50 transition-all"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${course.image}')` }}
                    ></div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <span className="material-symbols-outlined text-white text-5xl">
                        play_circle
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-bold text-slate-900 dark:text-white leading-tight mb-2 line-clamp-2 group-hover:text-[#135bec]">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      {course.instructor}
                    </p>

                    <div className="mt-auto pt-2">
                      <div className="flex justify-between items-end mb-1.5">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          {course.progress === 0
                            ? "Start Course"
                            : course.progress === 100
                              ? "Completed"
                              : `${course.progress}% Complete`}
                        </span>
                        {course.progress === 100 && (
                          <span className="material-symbols-outlined text-green-500 text-sm">
                            verified
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${course.progress === 100 ? "bg-green-500" : "bg-[#135bec]"}`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center flex flex-col items-center animate-fade-in">
              <span className="material-symbols-outlined text-6xl text-slate-400 mb-4">
                menu_book
              </span>
              <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300">
                No courses here yet
              </h3>
              <p className="text-slate-500 mt-2">
                When you enroll in a course, it will appear here.
              </p>
              <Link
                to="/"
                className="mt-6 px-6 py-3 bg-[#135bec] text-white font-bold rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-[#135bec]/20"
              >
                Browse Courses Now
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyLearning;
