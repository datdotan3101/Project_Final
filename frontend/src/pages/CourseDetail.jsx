import React, { useState } from "react";
import { Link } from "react-router-dom";

const CourseDetail = () => {
  // State để quản lý việc bật/tắt cửa sổ chat AI
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-slate-100 font-sans min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111722] px-6 lg:px-10 py-3 shadow-sm">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-4 text-slate-900 dark:text-white cursor-pointer"
          >
            <div className="size-8 flex items-center justify-center rounded bg-[#135bec]/20 text-[#135bec]">
              <span className="material-symbols-outlined text-2xl">school</span>
            </div>
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] hidden sm:block">
              EduMarket AI
            </h2>
          </Link>
          <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-96 w-[400px]">
            <div className="flex w-full flex-1 items-stretch rounded-full h-full border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-[#1e293b] overflow-hidden group focus-within:ring-2 focus-within:ring-[#135bec]/50">
              <div className="text-slate-400 flex items-center justify-center pl-4 bg-transparent">
                <span className="material-symbols-outlined text-xl">
                  search
                </span>
              </div>
              <input
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden bg-transparent text-slate-900 dark:text-white focus:outline-0 border-none h-full placeholder:text-slate-400 px-4 text-sm font-normal leading-normal"
                placeholder="Search for anything"
              />
            </div>
          </label>
        </div>
        <div className="flex flex-1 justify-end gap-4 lg:gap-8 items-center">
          <div className="hidden lg:flex items-center gap-6">
            <Link
              to="/"
              className="text-slate-600 dark:text-slate-300 hover:text-[#135bec] text-sm font-medium leading-normal transition-colors"
            >
              Categories
            </Link>
            <Link
              to="/"
              className="text-slate-600 dark:text-slate-300 hover:text-[#135bec] text-sm font-medium leading-normal transition-colors"
            >
              Teach on Platform
            </Link>
            <Link
              to="/"
              className="text-slate-600 dark:text-slate-300 hover:text-[#135bec] text-sm font-medium leading-normal transition-colors"
            >
              My Learning
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 cursor-pointer hover:text-[#135bec] lg:hidden">
              search
            </span>
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 cursor-pointer hover:text-[#135bec]">
              shopping_cart
            </span>
            <div className="hidden sm:flex gap-2">
              <Link
                to="/login"
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 px-4 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm font-bold leading-normal hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 px-4 bg-[#135bec] text-white text-sm font-bold leading-normal hover:bg-blue-700 transition-colors shadow-lg shadow-[#135bec]/30"
              >
                Sign up
              </Link>
            </div>
            <button className="lg:hidden text-slate-900 dark:text-white">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        {/* Hero Section with Background */}
        <div className="bg-[#1e293b] w-full text-white py-10">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative">
            <div className="lg:w-[60%] flex flex-col gap-4">
              {/* Breadcrumbs */}
              <div className="flex flex-wrap items-center gap-2 text-[#135bec] text-sm font-semibold mb-2">
                <Link to="/" className="hover:underline">
                  Development
                </Link>
                <span className="material-symbols-outlined text-xs">
                  chevron_right
                </span>
                <Link to="/" className="hover:underline">
                  Programming Languages
                </Link>
                <span className="material-symbols-outlined text-xs">
                  chevron_right
                </span>
                <Link to="/" className="hover:underline">
                  Python
                </Link>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                2024 Complete Python Bootcamp: From Zero to Hero in Python
              </h1>
              <p className="text-lg text-slate-300">
                Become a Python Programmer and learn one of employer's most
                requested skills of 2024!
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded">
                  <span className="text-yellow-400 font-bold">4.6</span>
                  <div className="flex text-yellow-400">
                    <span className="material-symbols-outlined text-sm fill-current">
                      star
                    </span>
                    <span className="material-symbols-outlined text-sm fill-current">
                      star
                    </span>
                    <span className="material-symbols-outlined text-sm fill-current">
                      star
                    </span>
                    <span className="material-symbols-outlined text-sm fill-current">
                      star
                    </span>
                    <span className="material-symbols-outlined text-sm fill-current">
                      star_half
                    </span>
                  </div>
                </div>
                <a
                  className="text-[#135bec] hover:text-blue-400 underline text-sm"
                  href="#reviews"
                >
                  (489,120 ratings)
                </a>
                <span className="text-slate-400 text-sm">
                  1,832,943 students
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm mt-1 text-slate-300">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    person
                  </span>
                  Created by{" "}
                  <a
                    className="text-[#135bec] hover:underline ml-1"
                    href="#instructor"
                  >
                    Jose Portilla
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    update
                  </span>
                  Last updated 12/2023
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    language
                  </span>
                  English
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">
                    subtitles
                  </span>
                  English [Auto]
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Sidebar Container & Main Content Layout */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-8 relative">
          <div className="lg:flex gap-12">
            {/* Right Column (Sticky Enrollment Card) */}
            <div className="hidden lg:block lg:w-[360px] lg:absolute lg:top-[-300px] lg:right-8 z-10 h-full">
              <div className="sticky top-24 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 shadow-2xl rounded-xl overflow-hidden">
                {/* Video Preview */}
                <div className="relative group cursor-pointer aspect-video bg-black">
                  <img
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                    alt="Python code on screen"
                    src="https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-white text-5xl fill-current">
                        play_arrow
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center font-bold text-white drop-shadow-md">
                    Preview this course
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <div className="flex items-end gap-3">
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                      $12.99
                    </h3>
                    <span className="text-lg text-slate-500 line-through decoration-slate-500 mb-1">
                      $84.99
                    </span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                      85% off
                    </span>
                  </div>
                  <div className="text-rose-500 flex items-center gap-1 text-sm font-medium">
                    <span className="material-symbols-outlined text-lg">
                      alarm
                    </span>
                    <span>2 days left at this price!</span>
                  </div>
                  <div className="flex flex-col gap-3 mt-2">
                    <button className="w-full bg-[#135bec] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-[#135bec]/25">
                      Add to cart
                    </button>
                    <button className="w-full bg-white dark:bg-transparent border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 font-bold py-3 px-4 rounded-lg transition-colors">
                      Buy now
                    </button>
                  </div>
                  <p className="text-xs text-center text-slate-500">
                    30-Day Money-Back Guarantee
                  </p>

                  <div className="mt-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">
                      This course includes:
                    </h4>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400 text-lg">
                          ondemand_video
                        </span>
                        22 hours on-demand video
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400 text-lg">
                          code
                        </span>
                        19 coding exercises
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400 text-lg">
                          description
                        </span>
                        15 articles
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400 text-lg">
                          all_inclusive
                        </span>
                        Full lifetime access
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400 text-lg">
                          devices
                        </span>
                        Access on mobile and TV
                      </li>
                      <li className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-400 text-lg">
                          emoji_events
                        </span>
                        Certificate of completion
                      </li>
                    </ul>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-4 mt-2">
                    <button className="text-sm font-semibold text-slate-900 dark:text-white underline">
                      Share
                    </button>
                    <button className="text-sm font-semibold text-slate-900 dark:text-white underline">
                      Gift this course
                    </button>
                    <button className="text-sm font-semibold text-slate-900 dark:text-white underline">
                      Apply Coupon
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Left Content Column */}
            <div className="lg:w-[60%] flex flex-col gap-10">
              {/* What you'll learn */}
              <div className="border border-slate-300 dark:border-slate-700 p-6 rounded-lg bg-white dark:bg-[#151e2e]">
                <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                  What you'll learn
                </h2>
                <div className="grid md:grid-cols-2 gap-x-4 gap-y-3">
                  {[
                    "Learn to use Python professionally, learning both Python 2 and Python 3!",
                    "Create games with Python, like Tic Tac Toe and Blackjack!",
                    "Learn advanced Python features, like the collections module and how to work with timestamps!",
                    "Learn to use Object Oriented Programming with classes!",
                    "Understand complex topics, like decorators.",
                    "Understand how to use both the Jupyter Notebook and create .py files",
                  ].map((text, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <span className="material-symbols-outlined text-slate-900 dark:text-slate-300 text-xl mt-0.5">
                        check
                      </span>
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Content */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                  Course content
                </h2>
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                  <span>23 sections • 155 lectures • 22h 13m total length</span>
                  <button className="text-[#135bec] font-bold hover:text-blue-400">
                    Expand all sections
                  </button>
                </div>

                <div className="border border-slate-300 dark:border-slate-700 rounded-lg divide-y divide-slate-300 dark:divide-slate-700 bg-white dark:bg-[#151e2e] overflow-hidden">
                  {/* Section 1 */}
                  <details className="group">
                    <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-50 dark:bg-[#1e293b] hover:bg-slate-100 dark:hover:bg-[#253146] transition-colors list-none">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-slate-900 dark:text-slate-300">
                          expand_more
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          Course Overview and Setup
                        </span>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        3 lectures • 10min
                      </span>
                    </summary>
                    <div className="p-4 bg-white dark:bg-[#151e2e] text-slate-700 dark:text-slate-300 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-base text-slate-400">
                            play_circle
                          </span>
                          <button className="hover:underline text-left">
                            Course Intro
                          </button>
                        </div>
                        <div className="flex items-center gap-4">
                          <button className="text-[#135bec] underline">
                            Preview
                          </button>
                          <span className="text-slate-500">03:45</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-base text-slate-400">
                            play_circle
                          </span>
                          <span>Course FAQs</span>
                        </div>
                        <span className="text-slate-500">04:12</span>
                      </div>
                    </div>
                  </details>

                  {/* Section 2 */}
                  <details className="group" open>
                    <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-50 dark:bg-[#1e293b] hover:bg-slate-100 dark:hover:bg-[#253146] transition-colors list-none">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-slate-900 dark:text-slate-300">
                          expand_more
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          Python Setup
                        </span>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        5 lectures • 35min
                      </span>
                    </summary>
                    <div className="p-4 bg-white dark:bg-[#151e2e] text-slate-700 dark:text-slate-300 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-base text-slate-400">
                            play_circle
                          </span>
                          <span>Command Line Basics</span>
                        </div>
                        <span className="text-slate-500">05:20</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-base text-slate-400">
                            play_circle
                          </span>
                          <span>Installing Python (Windows)</span>
                        </div>
                        <span className="text-slate-500">10:15</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-base text-slate-400">
                            play_circle
                          </span>
                          <span>Installing Python (MacOs)</span>
                        </div>
                        <span className="text-slate-500">08:45</span>
                      </div>
                    </div>
                  </details>

                  {/* Section 3 */}
                  <details className="group">
                    <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-50 dark:bg-[#1e293b] hover:bg-slate-100 dark:hover:bg-[#253146] transition-colors list-none">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined transition-transform group-open:rotate-180 text-slate-900 dark:text-slate-300">
                          expand_more
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          Python Object and Data Structure Basics
                        </span>
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        8 lectures • 52min
                      </span>
                    </summary>
                  </details>
                  <button className="w-full py-3 text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-[#1e293b] transition-colors border-t border-slate-300 dark:border-slate-700">
                    20 more sections
                  </button>
                </div>
              </div>

              {/* Instructor */}
              <div id="instructor">
                <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                  Instructor
                </h2>
                <div className="mb-4">
                  <button className="text-[#135bec] font-bold text-lg hover:underline">
                    Jose Portilla
                  </button>
                  <p className="text-slate-600 dark:text-slate-400 text-base">
                    Head of Data Science at Pierian Data Inc.
                  </p>
                </div>
                <div className="flex gap-6 items-start">
                  <img
                    className="w-24 h-24 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
                    alt="Instructor Jose Portilla"
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80"
                  />
                  <div className="flex-1 space-y-4">
                    <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-900 dark:text-white text-base">
                          star
                        </span>{" "}
                        4.6 Instructor Rating
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-900 dark:text-white text-base">
                          reviews
                        </span>{" "}
                        1,203,992 Reviews
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-900 dark:text-white text-base">
                          group
                        </span>{" "}
                        3,450,111 Students
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-900 dark:text-white text-base">
                          play_circle
                        </span>{" "}
                        65 Courses
                      </li>
                    </ul>
                    <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      <p className="mb-2">
                        Jose Marcial Portilla has a BS and MS in Mechanical
                        Engineering from Santa Clara University and years of
                        experience as a professional instructor and trainer for
                        Data Science and programming.
                      </p>
                      <button className="text-[#135bec] font-bold hover:underline">
                        Show more
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reviews & Ratings */}
              <div id="reviews">
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
                  Featured reviews
                </h2>
                <div className="flex flex-col gap-6">
                  {/* Review 1 */}
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center gap-1 min-w-[50px]">
                        <div className="size-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold">
                          JD
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          John Doe
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex text-yellow-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className="material-symbols-outlined text-base fill-current"
                              >
                                star
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-slate-500">
                            2 weeks ago
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                          This course is absolutely amazing. I went from knowing
                          nothing about Python to building my own small scripts
                          in just a few weeks. The instructor is very clear and
                          the exercises are challenging but fair. Highly
                          recommended!
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <p className="text-xs text-slate-500">
                            Was this review helpful?
                          </p>
                          <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-lg text-slate-900 dark:text-white">
                              thumb_up
                            </span>
                          </button>
                          <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-lg text-slate-900 dark:text-white">
                              thumb_down
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review 2 */}
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                    <div className="flex gap-4">
                      <div className="flex flex-col items-center gap-1 min-w-[50px]">
                        <img
                          className="size-12 rounded-full object-cover"
                          alt="Student Reviewer"
                          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 dark:text-white">
                          Sarah Smith
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex text-yellow-500">
                            {[1, 2, 3, 4].map((star) => (
                              <span
                                key={star}
                                className="material-symbols-outlined text-base fill-current"
                              >
                                star
                              </span>
                            ))}
                            <span className="material-symbols-outlined text-base text-slate-300 dark:text-slate-600">
                              star
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            1 month ago
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                          Great content, but Section 5 felt a bit rushed.
                          Overall worth the price, especially if you get it on
                          sale. The AI assistant feature on the site really
                          helped clarify some doubts instantly.
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <p className="text-xs text-slate-500">
                            Was this review helpful?
                          </p>
                          <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-lg text-slate-900 dark:text-white">
                              thumb_up
                            </span>
                          </button>
                          <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-lg text-slate-900 dark:text-white">
                              thumb_down
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button className="self-start px-4 py-2 border border-slate-900 dark:border-slate-100 text-slate-900 dark:text-white font-bold text-sm rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    See more reviews
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Enrollment Bar (Sticky Bottom) */}
        <div className="lg:hidden sticky bottom-0 z-40 bg-white dark:bg-[#1e293b] border-t border-slate-200 dark:border-slate-700 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                $12.99
              </span>
              <span className="text-xs text-slate-500 line-through">
                $84.99
              </span>
            </div>
            <button className="flex-1 bg-[#135bec] hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
              Buy now
            </button>
          </div>
        </div>

        {/* AI Assistant Widget */}
        <div className="fixed bottom-24 lg:bottom-8 right-6 lg:right-8 z-50 flex flex-col items-end gap-2">
          {/* Chat Box (Toggled by State) */}
          <div
            className={`w-80 bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-2 transition-all duration-300 origin-bottom-right ${isChatOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 hidden"}`}
          >
            <div className="bg-[#135bec] p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <span className="material-symbols-outlined">smart_toy</span>
                <h3 className="font-bold text-sm">Course AI Assistant</h3>
              </div>
              <button
                className="text-white hover:bg-white/20 rounded p-1"
                onClick={() => setIsChatOpen(false)}
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            <div className="p-4 h-64 overflow-y-auto bg-slate-50 dark:bg-[#151e2e] space-y-4">
              <div className="flex gap-2">
                <div className="size-8 rounded-full bg-[#135bec]/20 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#135bec] text-sm">
                    smart_toy
                  </span>
                </div>
                <div className="bg-white dark:bg-[#1e293b] p-3 rounded-lg rounded-tl-none border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 shadow-sm">
                  Hi! I'm here to help you understand if this Python course is
                  right for you. Ask me anything about the syllabus!
                </div>
              </div>
              <div className="flex gap-2 flex-row-reverse">
                <div className="bg-[#135bec] text-white p-3 rounded-lg rounded-tr-none text-xs shadow-sm">
                  Does this cover Machine Learning?
                </div>
              </div>
              <div className="flex gap-2">
                <div className="size-8 rounded-full bg-[#135bec]/20 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[#135bec] text-sm">
                    smart_toy
                  </span>
                </div>
                <div className="bg-white dark:bg-[#1e293b] p-3 rounded-lg rounded-tl-none border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 shadow-sm">
                  This course focuses on Python basics. While it touches on
                  libraries used in data science, for deep Machine Learning, I'd
                  recommend our specific "Data Science and Machine Learning
                  Bootcamp". Would you like a link?
                </div>
              </div>
            </div>
            <div className="p-3 bg-white dark:bg-[#1e293b] border-t border-slate-200 dark:border-slate-700">
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-slate-100 dark:bg-[#101622] border-none rounded text-xs px-3 py-2 text-slate-900 dark:text-white focus:ring-1 focus:ring-[#135bec] outline-none"
                  placeholder="Ask a question..."
                  type="text"
                />
                <button className="text-[#135bec] hover:bg-[#135bec]/10 rounded p-1">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </div>

          {/* Toggle Chat Button */}
          <button
            className="size-14 bg-[#135bec] text-white rounded-full shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center hover:scale-105 relative"
            onClick={() => setIsChatOpen(!isChatOpen)}
          >
            {/* Ping animation alert */}
            {!isChatOpen && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
              </span>
            )}
            <span className="material-symbols-outlined text-3xl">
              chat_spark
            </span>
          </button>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-black text-white py-10 px-6 border-t border-slate-800 mt-10">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="size-8 flex items-center justify-center rounded bg-white text-black">
              <span className="material-symbols-outlined text-2xl">school</span>
            </div>
            <span className="font-bold text-xl">EduMarket AI</span>
          </div>
          <div className="text-sm text-slate-400">
            © 2024 EduMarket AI, Inc.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CourseDetail;
