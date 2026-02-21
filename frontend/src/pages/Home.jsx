import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CourseCard from "../components/CourseCard"; // Import Component dùng chung

const Home = () => {
  // 1. State lưu danh sách khóa học lấy từ Backend
  const [courses, setCourses] = useState([]);

  // 2. Fetch API khi trang Home được render lần đầu
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Nhớ đổi port 5000 thành port backend của bạn
        const response = await axios.get("http://localhost:5000/api/courses");

        // Backend có thể trả về array trực tiếp hoặc bọc trong object (VD: response.data.courses)
        const rawCourses = response.data.courses || response.data;

        // 3. Chuẩn hóa dữ liệu từ DB để khớp với Props của CourseCard, tránh vỡ UI
        const formattedCourses = rawCourses.map((course) => ({
          id: course.id,
          title: course.title,
          // Nếu DB dùng trường 'thumbnail_url', ta map nó sang 'image' cho Component
          image:
            course.thumbnail_url ||
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
          category: course.category || "General",
          price: course.price,
          // Các trường dưới đây có thể DB chưa có, ta tạm dùng giá trị mặc định để giữ nguyên UI
          duration: course.duration || "12h",
          instructor: course.instructor?.name || "EduMarket Instructor",
          rating: course.rating || 4.8,
          reviewsCount: course.reviewsCount || "1,200",
          originalPrice: course.price ? (course.price * 1.5).toFixed(2) : 84.99,
          isBestseller: course.isBestseller || false,
        }));

        setCourses(formattedCourses);
      } catch (error) {
        console.error("Lỗi khi fetch danh sách khóa học:", error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101622] font-sans antialiased text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#111722]/95 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="size-8 text-[#135bec]">
                <svg
                  className="w-full h-full"
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
                    fill="currentColor"
                  ></path>
                  <path
                    clipRule="evenodd"
                    d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
              <span className="text-white text-xl font-bold tracking-tight">
                EduMarket
              </span>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/"
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                Explore
              </Link>
              <Link
                to="/my-learning"
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                My Learning
              </Link>
              <Link
                to="/"
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
              >
                Teach on Platform
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  search
                </span>
              </button>
              <Link
                to="/cart"
                className="relative text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  shopping_cart
                </span>
                <span className="absolute top-1.5 right-1.5 size-2 bg-[#135bec] rounded-full"></span>
              </Link>
              <button className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  notifications
                </span>
              </button>

              {/* Profile Dropdown Trigger */}
              <div className="relative group ml-2">
                <button className="flex items-center gap-2 focus:outline-none">
                  <div
                    className="size-9 rounded-full bg-cover bg-center border-2 border-slate-700 group-hover:border-[#135bec] transition-colors"
                    style={{
                      backgroundImage:
                        "url('https://ui-avatars.com/api/?name=John+Doe&background=135bec&color=fff')",
                    }}
                  ></div>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#1e293b] border border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                  <div className="p-3 border-b border-slate-700">
                    <p className="text-sm font-semibold text-white">John Doe</p>
                    <p className="text-xs text-slate-400">
                      student@example.com
                    </p>
                  </div>
                  <div className="p-2">
                    <Link
                      to="/my-learning"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 rounded-md"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        school
                      </span>{" "}
                      My Learning
                    </Link>
                    <Link
                      to="/wishlist"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 rounded-md"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        favorite
                      </span>{" "}
                      Wishlist
                    </Link>
                    <Link
                      to="/"
                      className="flex items-center justify-between px-3 py-2 text-sm text-slate-300 hover:bg-slate-700/50 rounded-md group/switch"
                    >
                      <Link
                        to="/instructor/dashboard"
                        className="flex items-center gap-2"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          cast_for_education
                        </span>{" "}
                        Instructor Mode
                      </Link>
                      <div className="w-8 h-4 bg-slate-600 rounded-full relative">
                        <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full transition-transform group-hover/switch:translate-x-full"></div>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2 border-t border-slate-700">
                    <Link
                      to="/login"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-700/50 rounded-md"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        logout
                      </span>{" "}
                      Log out
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section with AI Search */}
        <section className="relative bg-[#101622] py-12 lg:py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#135bec]/10 blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/10 blur-[120px]"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                Unlock your potential with <br className="hidden md:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#135bec] to-purple-400">
                  AI-guided learning
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light">
                Describe your career goals or what you want to build to get
                personalized course recommendations instantly.
              </p>
            </div>

            {/* AI Search Input */}
            <div className="w-full max-w-2xl group">
              <div className="relative flex items-center w-full h-16 rounded-xl bg-[#1e293b]/80 border border-[#135bec]/30 shadow-[0_0_15px_rgba(19,91,236,0.15)] backdrop-blur-sm transition-all duration-300 focus-within:border-[#135bec] focus-within:shadow-[0_0_25px_rgba(19,91,236,0.3)] focus-within:scale-[1.01]">
                <div className="pl-5 pr-3 text-[#135bec] animate-pulse">
                  <span className="material-symbols-outlined text-[28px]">
                    auto_awesome
                  </span>
                </div>
                <input
                  className="w-full h-full bg-transparent border-none text-white placeholder-slate-400 text-lg focus:ring-0 focus:outline-none"
                  placeholder="Ask AI what to learn next..."
                  type="text"
                />
                <div className="pr-2">
                  <button className="h-12 px-6 bg-[#135bec] hover:bg-blue-600 text-white font-semibold rounded-lg transition-all flex items-center gap-2">
                    <span>Search</span>
                    <span className="material-symbols-outlined text-[20px]">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Suggested Prompts */}
            <div className="flex flex-wrap justify-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e293b] border border-slate-700 hover:border-[#135bec]/50 hover:bg-[#253248] transition-colors group">
                <span className="material-symbols-outlined text-[18px] text-purple-400 group-hover:text-[#135bec] transition-colors">
                  code
                </span>
                <span className="text-sm text-slate-300">
                  Python for Data Science
                </span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e293b] border border-slate-700 hover:border-[#135bec]/50 hover:bg-[#253248] transition-colors group">
                <span className="material-symbols-outlined text-[18px] text-pink-400 group-hover:text-[#135bec] transition-colors">
                  brush
                </span>
                <span className="text-sm text-slate-300">
                  Graphic Design for Beginners
                </span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e293b] border border-slate-700 hover:border-[#135bec]/50 hover:bg-[#253248] transition-colors group">
                <span className="material-symbols-outlined text-[18px] text-teal-400 group-hover:text-[#135bec] transition-colors">
                  smartphone
                </span>
                <span className="text-sm text-slate-300">
                  React Native Masterclass
                </span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1e293b] border border-slate-700 hover:border-[#135bec]/50 hover:bg-[#253248] transition-colors group">
                <span className="material-symbols-outlined text-[18px] text-orange-400 group-hover:text-[#135bec] transition-colors">
                  campaign
                </span>
                <span className="text-sm text-slate-300">
                  Digital Marketing 101
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Stats / Trust Bar */}
        <section className="border-y border-slate-800 bg-[#0f151f]">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#135bec]">
                  play_circle
                </span>
                <span className="font-medium">200k+ Online Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#135bec]">
                  group
                </span>
                <span className="font-medium">50M+ Students</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#135bec]">
                  all_inclusive
                </span>
                <span className="font-medium">Lifetime Access</span>
              </div>
            </div>
          </div>
        </section>

        {/* Course Section: Trending */}
        <section className="py-12 bg-[#101622] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Trending Now
            </h2>
            <Link
              to="/"
              className="text-[#135bec] hover:text-blue-400 font-medium text-sm flex items-center gap-1"
            >
              View all{" "}
              <span className="material-symbols-outlined text-[18px]">
                chevron_right
              </span>
            </Link>
          </div>

          {/* Courses  */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Nếu mảng courses rỗng thì hiển thị thông báo, ngược lại map dữ liệu thật ra thẻ CourseCard */}
            {courses.length === 0 ? (
              <p className="text-slate-400 col-span-full">
                No courses available at the moment.
              </p>
            ) : (
              courses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))
            )}
          </div>
        </section>

        {/* Become an Instructor CTA */}
        <section className="py-16 bg-[#131b29] border-y border-slate-800">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 relative">
                <div className="absolute inset-0 bg-[#135bec]/20 blur-[60px] rounded-full"></div>
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl border border-slate-700">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                      backgroundImage:
                        "url('https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80')",
                    }}
                  ></div>
                  {/* Overlay Content */}
                  <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-white flex items-center justify-center text-[#135bec] font-bold shadow-lg">
                        <span className="material-symbols-outlined">
                          verified
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-bold">
                          Trusted by 15,000+ Instructors
                        </p>
                        <p className="text-slate-300 text-sm">
                          Join the community
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-1/2 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Become an Instructor
                </h2>
                <p className="text-lg text-slate-400">
                  Instructors from around the world teach millions of students
                  on EduMarket. We provide the tools and skills to teach what
                  you love.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-slate-300">
                    <span className="material-symbols-outlined text-[#135bec] pt-1">
                      check_circle
                    </span>
                    <span>Build your personal brand and audience</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <span className="material-symbols-outlined text-[#135bec] pt-1">
                      check_circle
                    </span>
                    <span>Get paid for every student you teach</span>
                  </li>
                  <li className="flex items-start gap-3 text-slate-300">
                    <span className="material-symbols-outlined text-[#135bec] pt-1">
                      check_circle
                    </span>
                    <span>Flexible schedule, teach from anywhere</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <button className="px-8 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors shadow-lg shadow-white/5">
                    Start Teaching Today
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Categories */}
        <section className="py-12 bg-[#101622] max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Top Categories
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Link
              to="/"
              className="group p-4 bg-[#1e293b] border border-slate-800 rounded-lg hover:border-[#135bec]/50 hover:bg-[#253248] transition-all flex flex-col gap-3"
            >
              <div className="p-3 bg-slate-800 rounded-lg w-fit text-white group-hover:bg-[#135bec] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[24px]">
                  code
                </span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-[#135bec] transition-colors">
                Development
              </h3>
            </Link>
            <Link
              to="/"
              className="group p-4 bg-[#1e293b] border border-slate-800 rounded-lg hover:border-[#135bec]/50 hover:bg-[#253248] transition-all flex flex-col gap-3"
            >
              <div className="p-3 bg-slate-800 rounded-lg w-fit text-white group-hover:bg-[#135bec] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[24px]">
                  paid
                </span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-[#135bec] transition-colors">
                Business
              </h3>
            </Link>
            <Link
              to="/"
              className="group p-4 bg-[#1e293b] border border-slate-800 rounded-lg hover:border-[#135bec]/50 hover:bg-[#253248] transition-all flex flex-col gap-3"
            >
              <div className="p-3 bg-slate-800 rounded-lg w-fit text-white group-hover:bg-[#135bec] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[24px]">
                  palette
                </span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-[#135bec] transition-colors">
                Design
              </h3>
            </Link>
            <Link
              to="/"
              className="group p-4 bg-[#1e293b] border border-slate-800 rounded-lg hover:border-[#135bec]/50 hover:bg-[#253248] transition-all flex flex-col gap-3"
            >
              <div className="p-3 bg-slate-800 rounded-lg w-fit text-white group-hover:bg-[#135bec] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[24px]">
                  campaign
                </span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-[#135bec] transition-colors">
                Marketing
              </h3>
            </Link>
            <Link
              to="/"
              className="group p-4 bg-[#1e293b] border border-slate-800 rounded-lg hover:border-[#135bec]/50 hover:bg-[#253248] transition-all flex flex-col gap-3"
            >
              <div className="p-3 bg-slate-800 rounded-lg w-fit text-white group-hover:bg-[#135bec] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[24px]">
                  terminal
                </span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-[#135bec] transition-colors">
                IT & Software
              </h3>
            </Link>
            <Link
              to="/"
              className="group p-4 bg-[#1e293b] border border-slate-800 rounded-lg hover:border-[#135bec]/50 hover:bg-[#253248] transition-all flex flex-col gap-3"
            >
              <div className="p-3 bg-slate-800 rounded-lg w-fit text-white group-hover:bg-[#135bec] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[24px]">
                  camera_alt
                </span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-[#135bec] transition-colors">
                Photography
              </h3>
            </Link>
            <Link
              to="/"
              className="group p-4 bg-[#1e293b] border border-slate-800 rounded-lg hover:border-[#135bec]/50 hover:bg-[#253248] transition-all flex flex-col gap-3"
            >
              <div className="p-3 bg-slate-800 rounded-lg w-fit text-white group-hover:bg-[#135bec] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[24px]">
                  piano
                </span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-[#135bec] transition-colors">
                Music
              </h3>
            </Link>
            <Link
              to="/"
              className="group p-4 bg-[#1e293b] border border-slate-800 rounded-lg hover:border-[#135bec]/50 hover:bg-[#253248] transition-all flex flex-col gap-3"
            >
              <div className="p-3 bg-slate-800 rounded-lg w-fit text-white group-hover:bg-[#135bec] group-hover:text-white transition-colors">
                <span className="material-symbols-outlined text-[24px]">
                  psychology
                </span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-[#135bec] transition-colors">
                Personal Development
              </h3>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0b0f17] text-slate-400 border-t border-slate-800 mt-auto">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold mb-4">EduMarket Business</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Teach on EduMarket
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Get the app
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    About us
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Contact us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Careers</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Help and Support
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Affiliate
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Investors
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Terms</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Cookie settings
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Sitemap
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Accessibility statement
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <button className="flex items-center gap-2 border border-slate-600 px-4 py-2 rounded text-white hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-[18px]">
                  language
                </span>
                <span>English</span>
              </button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-800 gap-4">
            <div className="flex items-center gap-2">
              <div className="size-6 text-[#135bec]">
                <svg
                  className="w-full h-full"
                  fill="none"
                  viewBox="0 0 48 48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
                    fill="currentColor"
                  ></path>
                  <path
                    clipRule="evenodd"
                    d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  ></path>
                </svg>
              </div>
              <span className="font-bold text-white">EduMarket</span>
            </div>
            <p className="text-xs">© 2024 EduMarket, Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
