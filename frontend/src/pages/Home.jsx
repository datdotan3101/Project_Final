import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import CourseCarousel from "../components/CourseCarousel";
import { useChat } from "../context/ChatContext";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { setIsChatOpen } = useChat();
  const navigate = useNavigate();

  // Lấy danh sách khóa học
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses");
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách khóa học lúc này.");
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleNormalSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    navigate(`/courses?search=${encodeURIComponent(searchInput.trim())}`);
  };

  return (
    <div className="bg-[#0b1120] min-h-screen text-slate-300 pb-20 font-sans">
      {/* ================= HERO SECTION ================= */}
      <div className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>

        <h1 className="text-6xl md:text-7xl font-black text-white mb-8 tracking-tight leading-[1.1]">
          Learn without <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            limits.
          </span>
        </h1>

        <p className="text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
          Master new skills with our professional курсы và nhận được sự hỗ trợ
          thông minh từ AI.
        </p>

        {/* ================= NORMAL SEARCH BAR ================= */}
        <div className="max-w-3xl mx-auto mb-6">
          <form onSubmit={handleNormalSearch} className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/50 to-purple-600/50 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-focus-within:opacity-100"></div>

            <div className="relative flex items-center bg-[#1c2431] rounded-2xl border border-slate-700/50 shadow-2xl p-2 pl-6">
              <span className="material-symbols-outlined text-slate-500 mr-4">
                search
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for any course..."
                className="flex-1 bg-transparent border-none text-white text-lg focus:outline-none placeholder:text-slate-600 py-3"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-10 rounded-xl transition-all duration-300 shadow-xl shadow-blue-600/20 active:scale-95 flex items-center gap-2"
              >
                Search
                <span className="material-symbols-outlined text-sm">
                  arrow_forward
                </span>
              </button>
            </div>
          </form>
        </div>

        {/* ================= AI ASSISTANT TRIGGER ================= */}
        <div className="flex justify-center items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-black text-blue-400 transition-all hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined animate-pulse text-indigo-400">
              auto_awesome
            </span>
            Ask AI Assistant
          </button>
          <span className="text-slate-600 font-bold text-xs uppercase tracking-widest">
            or
          </span>
          <div className="flex gap-2">
            {["Python", "React", "Business"].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/courses?search=${tag}`)}
                className="text-slate-500 hover:text-white text-sm font-bold transition"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= STATS SECTION ================= */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
        {[
          {
            label: "Online Courses",
            count: "250K+",
            icon: "play_circle",
            color: "text-blue-500",
          },
          {
            label: "Active Students",
            count: "45M+",
            icon: "group",
            color: "text-indigo-500",
          },
          {
            label: "Lifetime Access",
            count: "24/7",
            icon: "all_inclusive",
            color: "text-purple-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-[#1c2431] border border-slate-800 p-8 rounded-3xl flex items-center gap-6 group hover:border-slate-700 transition duration-500"
          >
            <div
              className={`w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center ${stat.color} shadow-inner group-hover:scale-110 transition duration-500`}
            >
              <span className="material-symbols-outlined text-3xl">
                {stat.icon}
              </span>
            </div>
            <div>
              <div className="text-3xl font-black text-white">{stat.count}</div>
              <div className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= COURSE CAROUSELS ================= */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="max-w-7xl mx-auto p-8 text-center text-red-400 font-bold bg-red-400/10 rounded-3xl border border-red-400/20">
            {error}
          </div>
        ) : (
          <>
            <CourseCarousel
              title="Recommended for you"
              courses={courses.slice(0, 10)}
            />
            <CourseCarousel
              title="Top Design Courses"
              courses={courses.filter((c) => c.category === "Design")}
            />
            <CourseCarousel
              title="Best in Development"
              courses={courses.filter((c) => c.category === "Development")}
            />
          </>
        )}
      </div>

      {/* ================= CATEGORIES ================= */}
      <div className="max-w-7xl mx-auto px-4 mt-24 mb-20">
        <h2 className="text-4xl font-black text-white mb-12 tracking-tight">
          Top Categories
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Development", icon: "code", color: "blue" },
            { name: "Business", icon: "payments", color: "green" },
            { name: "Design", icon: "palette", color: "pink" },
            { name: "Marketing", icon: "campaign", color: "orange" },
          ].map((cat, i) => (
            <Link
              key={i}
              to={`/courses?category=${cat.name}`}
              className="bg-[#1c2431] border border-slate-800 p-8 rounded-3xl flex flex-col gap-6 hover:border-blue-500/50 group transition duration-500 active:scale-[0.98]"
            >
              <div
                className={`w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 transition duration-500`}
              >
                <span className="material-symbols-outlined text-3xl text-white group-hover:scale-110 transition duration-500">
                  {cat.icon}
                </span>
              </div>
              <h3 className="text-xl font-black text-white">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
