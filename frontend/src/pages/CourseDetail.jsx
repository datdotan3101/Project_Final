import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import WishlistButton from "../components/WishlistButton";

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState({});
  const [activeTab, setActiveTab] = useState("personal");

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/courses/${id}`,
        );
        setCourse(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(
          "Không thể tải thông tin khóa học hoặc khóa học không tồn tại.",
        );
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const toggleSection = (sectionId) => {
    setIsExpanded((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const handleBuyNow = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để mua khóa học!");
      navigate("/login");
      return;
    }
    navigate(`/checkout/${course.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#0b1120] flex items-center justify-center p-4">
        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-8 rounded-2xl shadow-2xl text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0b1120] min-h-screen text-slate-300 font-sans pb-20">
      {/* ================= DARK HEADER ================= */}
      <div className="bg-[#1c1d1f] py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
          <div className="flex-1 md:pr-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-[#a0a4a7] text-sm font-bold mb-4">
              <Link
                to="/courses"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Development
              </Link>
              <span className="text-xs">›</span>
              <Link
                to="/courses"
                className="text-blue-400 hover:text-blue-300 transition"
              >
                Programming Languages
              </Link>
              <span className="text-xs">›</span>
              <span className="font-medium">Python</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
              {course.title}
            </h1>
            <p className="text-lg text-white mb-6 leading-relaxed max-w-3xl font-medium">
              {course.description ||
                "Master the skills needed to succeed in this comprehensive course guided by industry experts."}
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
              <span className="bg-[#eceb98] text-[#3d3c0a] px-2 py-0.5 rounded font-black text-xs uppercase">
                Bestseller
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[#f69c08] font-bold text-base">4.8</span>
                <div className="flex text-[#f69c08] text-xs">★★★★★</div>
              </div>
              <span className="text-blue-400 underline cursor-pointer">
                (12,450 ratings)
              </span>
              <span className="text-white">145,230 students</span>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-white">Created by</span>
                <span className="text-blue-400 font-bold hover:underline cursor-pointer">
                  {course.lecturer?.name || "Anonymous Expert"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-white">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    info
                  </span>
                  Last updated 12/2023
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    language
                  </span>
                  English
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">
                    closed_caption
                  </span>
                  English [Auto]
                </div>
              </div>
            </div>
          </div>

          {/* Spacer for Sidebar ghosting */}
          <div className="hidden md:block w-[340px] flex-shrink-0"></div>
        </div>
      </div>

      {/* ================= MAIN CONTENT + SIDEBAR ================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 md:-mt-80 flex flex-col md:flex-row gap-12 relative z-10">
        {/* LEFT COLUMN */}
        <div className="flex-1 order-2 md:order-1 pt-32 md:pt-80">
          {/* What you'll learn */}
          <div className="bg-[#1c1d1f] rounded-none border border-slate-700/50 p-6 mb-8 shadow-xl">
            <h2 className="text-2xl font-black text-white mb-6">
              What you'll learn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
              {[
                "Learn JavaScript from scratch and in great detail - from beginner to advanced",
                "Everything you need to become a JavaScript expert and apply for JavaScript jobs",
                "All about variables, functions, objects and arrays",
                "Deep dives into prototypes, JavaScript engines & how it works behind the scenes",
                "Project-driven learning with plenty of examples",
                "Object-oriented programming",
                "Manipulating web pages (= the DOM) with JavaScript",
                "All core features and concepts you need to know in modern JavaScript development",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 text-sm leading-relaxed text-[#d1d7dc]"
                >
                  <span className="material-symbols-outlined text-slate-400 text-sm mt-1">
                    check
                  </span>
                  {item}
                </div>
              ))}
            </div>
            <button className="mt-6 text-blue-400 font-bold text-sm hover:text-blue-300">
              Show more ⌵
            </button>
          </div>

          {/* Explore related topics */}
          <div className="mb-12">
            <h2 className="text-2xl font-black text-white mb-6">
              Explore related topics
            </h2>
            <div className="flex flex-wrap gap-3">
              {["JavaScript", "Programming Languages", "Development"].map(
                (tag) => (
                  <button
                    key={tag}
                    className="px-5 py-2.5 rounded-full border border-slate-600 font-bold text-sm hover:bg-slate-800 transition text-white"
                  >
                    {tag}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* This course includes */}
          <div className="mb-12">
            <h2 className="text-2xl font-black text-white mb-6">
              This course includes:
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              {[
                { icon: "movie", text: "52 hours on-demand video" },
                { icon: "terminal", text: "11 coding exercises" },
                { icon: "assignment", text: "Assignments" },
                { icon: "description", text: "77 articles" },
                { icon: "download", text: "696 downloadable resources" },
                { icon: "devices", text: "Access on mobile and TV" },
                { icon: "closed_caption", text: "Closed captions" },
                {
                  icon: "workspace_premium",
                  text: "Certificate of completion",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-white">
                  <span className="material-symbols-outlined text-lg">
                    {item.icon}
                  </span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course content */}
          <div className="mb-12">
            <h2 className="text-2xl font-black text-white mb-6">
              Course content
            </h2>
            <div className="flex justify-between items-center mb-4 text-sm text-slate-400">
              <div>36 sections • 617 lectures • 52h 32m total length</div>
              <button className="text-blue-500 font-bold">
                Expand all sections
              </button>
            </div>
            <div className="border border-slate-700/50">
              {course.sections?.map((section, idx) => (
                <div
                  key={section.id}
                  className="border-b border-slate-700/50 last:border-b-0"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full h-14 px-6 flex items-center justify-between bg-[#1c1d1f] hover:bg-slate-800 transition"
                  >
                    <div className="flex items-center gap-3 font-bold text-white">
                      <span
                        className={`material-symbols-outlined transition-transform ${isExpanded[section.id] ? "rotate-180" : ""}`}
                      >
                        expand_more
                      </span>
                      {section.title}
                    </div>
                    <div className="text-xs text-slate-400">
                      {section.lessons?.length} lectures • 1hr
                    </div>
                  </button>
                  {isExpanded[section.id] && (
                    <div className="bg-[#1c1d1f] border-t border-slate-800">
                      {section.lessons?.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="h-12 px-12 flex items-center justify-between hover:bg-slate-800 transition text-sm"
                        >
                          <div className="flex items-center gap-3 text-slate-300">
                            <span className="material-symbols-outlined text-sm">
                              play_circle
                            </span>
                            {lesson.title}
                          </div>
                          <div className="text-slate-500 underline text-xs cursor-pointer">
                            Preview
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <button className="w-full py-3 bg-[#1c1d1f] text-indigo-400 font-bold border-t border-slate-700 hover:bg-slate-800">
                26 more sections
              </button>
            </div>
          </div>

          {/* Requirements */}
          <div className="mb-16">
            <h2 className="text-2xl font-black text-white mb-6">
              Requirements
            </h2>
            <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm font-medium">
              <li>NO prior JavaScript knowledge is required</li>
              <li>Basic web development knowledge is recommended</li>
              <li>
                Basic understanding of HTML and CSS helps but is NOT required
              </li>
            </ul>
          </div>

          {/* Instructor - At the bottom */}
          <div className="mb-16 pt-12 border-t border-slate-800">
            <h2 className="text-2xl font-black text-white mb-6">Instructor</h2>
            <h3 className="text-blue-400 font-bold text-lg underline underline-offset-4 mb-2">
              {course.lecturer?.name || "Expert Instructor"}
            </h3>
            <p className="text-slate-400 mb-6">
              Head of Data Science at AI Institute
            </p>
            <div className="flex items-start gap-6 mb-6">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200"
                className="w-28 h-28 rounded-full object-cover border-2 border-slate-700 shadow-xl"
                alt="Instructor"
              />
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-[#f69c08]">
                    star
                  </span>{" "}
                  4.8 Instructor Rating
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-blue-400">
                    reviews
                  </span>{" "}
                  1.2M Reviews
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-indigo-400">
                    group
                  </span>{" "}
                  3.4M Students
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-sm text-purple-400">
                    play_lesson
                  </span>{" "}
                  65 Courses
                </div>
              </div>
            </div>
            <p className="text-[#d1d7dc] text-sm leading-relaxed mb-4">
              Our instructor is a professional with 15+ years of industry
              experience. They have helped millions of students worldwide to
              launch their careers in technology and business...
            </p>
            <button className="text-blue-400 font-bold text-sm">
              Show more
            </button>
          </div>

          {/* Featured reviews - At the bottom */}
          <div className="mb-16">
            <h2 className="text-2xl font-black text-white mb-8">
              Featured reviews
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-6 bg-[#1c1d1f] border border-slate-700/50 rounded-xl shadow-lg"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-black">
                      JD
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">
                        John Doe
                      </div>
                      <div className="flex text-[#f69c08] text-[10px]">
                        ★★★★★{" "}
                        <span className="text-slate-500 ml-2">2 weeks ago</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm italic mb-4">
                    "This course is absolutely amazing. I went from knowing
                    nothing about Python to building scripts in weeks."
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-bold">
                    <span>Was this review helpful?</span>
                    <span className="material-symbols-outlined text-sm hover:text-white cursor-pointer transition">
                      thumb_up
                    </span>
                    <span className="material-symbols-outlined text-sm hover:text-white cursor-pointer transition">
                      thumb_down
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-8 px-6 py-3 border border-white text-white font-bold text-sm hover:bg-slate-800">
              Show all reviews
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN (SIDEBAR) */}
        <div className="w-full md:w-[340px] flex-shrink-0 order-1 md:order-2">
          <div className="sticky top-12 bg-[#1c1d1f] border border-slate-700 shadow-2xl overflow-hidden">
            {/* Preview Image */}
            <div className="relative group cursor-pointer">
              <img
                src={`http://localhost:5000${course.thumbnail_url}`}
                className="w-full aspect-video object-cover"
                alt="Course"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black mb-3">
                  <span className="material-symbols-outlined text-4xl">
                    play_arrow
                  </span>
                </div>
                <span className="text-white font-bold">
                  Preview this course
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-700">
              <button
                onClick={() => setActiveTab("personal")}
                className={`flex-1 py-4 font-bold text-sm transition ${activeTab === "personal" ? "text-white border-b-4 border-white" : "text-slate-500"}`}
              >
                Personal
              </button>
              <button
                onClick={() => setActiveTab("teams")}
                className={`flex-1 py-4 font-bold text-sm transition ${activeTab === "teams" ? "text-white border-b-4 border-white" : "text-slate-500"}`}
              >
                Teams
              </button>
            </div>

            {/* Content Areas */}
            <div className="p-6">
              {activeTab === "personal" ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-white mb-2 leading-tight">
                      Subscribe to Udemy's top courses
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Get this course, plus 39,000+ of our top-rated courses,
                      with Personal Plan.{" "}
                      <span className="text-blue-400 underline cursor-pointer">
                        Learn more
                      </span>
                    </p>
                  </div>

                  <button className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-base transition active:scale-[0.98]">
                    Start subscription
                  </button>

                  <div className="text-center">
                    <div className="text-slate-500 text-[10px]">
                      Starting at ₫250,000 per month
                    </div>
                    <div className="text-slate-500 text-[10px]">
                      Cancel anytime
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-slate-700">
                    <hr className="flex-1 border-slate-700" />
                    <span className="text-xs uppercase font-bold text-slate-500">
                      or
                    </span>
                    <hr className="flex-1 border-slate-700" />
                  </div>

                  <div className="text-3xl font-black text-white">
                    ₫{course.price?.toLocaleString("vi-VN")}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-3.5 border border-white text-white font-black text-sm hover:bg-slate-800 transition">
                      Add to cart
                    </button>
                    <WishlistButton
                      courseId={id}
                      className="relative !top-0 !right-0 !bg-transparent !border-white !rounded-none !w-12 !h-auto flex items-center justify-center"
                    />
                  </div>

                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3.5 border border-white text-white font-black text-sm hover:bg-slate-800 transition"
                  >
                    Buy now
                  </button>

                  <div className="text-center text-[10px] text-slate-500 space-y-1">
                    <div>30-Day Money-Back Guarantee</div>
                    <div>Full Lifetime Access</div>
                  </div>

                  <div className="flex justify-around text-xs font-bold text-white underline underline-offset-4">
                    <button>Share</button>
                    <button>Gift this course</button>
                    <button>Apply Coupon</button>
                  </div>

                  <div className="p-4 border border-dashed border-slate-600 rounded">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                      KEEPLEARNING is applied
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Udemy coupon
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-xl font-black text-white">
                    Access this course for your team
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Over 16,000 teams use Udemy Business to learn and grow their
                    skills.
                  </p>
                  <button className="w-full py-3.5 bg-white text-black font-black text-base hover:bg-slate-200 transition">
                    Try Udemy Business
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
