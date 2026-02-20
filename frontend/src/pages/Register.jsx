import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLecturer, setIsLecturer] = useState(false);
  const [specialization, setSpecialization] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert("Vui lòng đồng ý với Điều khoản và Chính sách!");
      return;
    }

    // Dữ liệu chuẩn bị gửi xuống Backend
    const payload = {
      name,
      email,
      password,
      role: isLecturer ? "LECTURER" : "STUDENT",
      // specialization có thể gửi kèm nếu backend bạn sau này có thêm cột lưu thông tin này
    };

    console.log("Submit Register Payload:", payload);

    // TODO: Tích hợp gọi API đăng ký tại đây
    // try {
    //   const response = await axios.post('/api/auth/register', payload);
    //   alert("Đăng ký thành công!");
    //   navigate('/login');
    // } catch (error) { console.error(error); }
  };

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 lg:px-20 py-4 bg-white dark:bg-[#101622] z-10">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 text-[#135bec]">
            <div className="size-8 bg-[#135bec] rounded-lg flex items-center justify-center text-white">
              <span className="material-symbols-outlined">school</span>
            </div>
            <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">
              EduMarket AI
            </h2>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-[#135bec] transition-colors"
            >
              Browse Courses
            </Link>
            <Link
              to="/"
              className="text-slate-600 dark:text-slate-400 text-sm font-medium hover:text-[#135bec] transition-colors"
            >
              AI Path
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm text-slate-500">
            Already have an account?
          </span>
          <Link
            to="/login"
            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 border border-[#135bec] text-[#135bec] text-sm font-bold hover:bg-[#135bec]/5 transition-all"
          >
            Log In
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Side Banner */}
        <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-center px-16 xl:px-24 bg-[#135bec] overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  height="40"
                  id="grid"
                  patternUnits="userSpaceOnUse"
                  width="40"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="white"
                    strokeWidth="1"
                  ></path>
                </pattern>
              </defs>
              <rect fill="url(#grid)" height="100%" width="100%"></rect>
            </svg>
          </div>
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

          <div className="relative z-10 text-white">
            <div className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-sm font-medium">
              <span className="material-symbols-outlined text-sm">
                auto_awesome
              </span>
              Powered by Advanced AI
            </div>
            <h1 className="text-5xl xl:text-6xl font-black leading-tight mb-8">
              Unlock your potential with{" "}
              <span className="underline decoration-white/30">AI-driven</span>{" "}
              learning.
            </h1>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-none size-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">
                    route
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    Personalized Course Tracks
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    Our AI analyzes your goals to create a unique learning
                    roadmap just for you.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-none size-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">
                    smart_toy
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    24/7 AI Tutor Support
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    Never get stuck. Ask questions and get instant feedback at
                    any hour of the day.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-none size-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">
                    verified_user
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    Industry Expert Mentors
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    Learn from top-tier professionals and earn certificates
                    recognized by major employers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 xl:p-20 bg-[#f6f6f8] dark:bg-[#101622]">
          <div className="max-w-md w-full">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-2">
                Create Account
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Join our community and start your journey today.
              </p>
            </div>

            <div className="mb-8">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium text-slate-700 dark:text-slate-200 shadow-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  ></path>
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  ></path>
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  ></path>
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  ></path>
                </svg>
                Continue with Google
              </button>
            </div>

            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-slate-700"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#f6f6f8] dark:bg-[#101622] px-2 text-slate-500">
                  Or continue with email
                </span>
              </div>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Full Name
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                    person
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#135bec]/20 focus:border-[#135bec] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                    placeholder="John Doe"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Email Address
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                    mail
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#135bec]/20 focus:border-[#135bec] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                    placeholder="john@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Create Password
                </label>
                <div className="relative group mb-2">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                    lock
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#135bec]/20 focus:border-[#135bec] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                {/* Password Strength Indicator (UI Only) */}
                <div className="flex gap-1 h-1 w-full rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <div
                    className={`w-1/3 rounded-full ${password.length > 0 ? "bg-red-500" : "bg-transparent"} ${password.length >= 6 ? "bg-yellow-500" : ""} ${password.length >= 8 ? "bg-green-500" : ""}`}
                  ></div>
                  <div
                    className={`w-1/3 rounded-full ${password.length >= 6 ? "bg-yellow-500" : "bg-transparent"} ${password.length >= 8 ? "bg-green-500" : ""}`}
                  ></div>
                  <div
                    className={`w-1/3 rounded-full ${password.length >= 8 ? "bg-green-500" : "bg-transparent"}`}
                  ></div>
                </div>
              </div>

              <div className="pt-2">
                <label className="relative flex items-center cursor-pointer mb-4 select-none">
                  <input
                    className="sr-only peer"
                    type="checkbox"
                    checked={isLecturer}
                    onChange={(e) => setIsLecturer(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#135bec]"></div>
                  <span className="ms-3 text-sm font-medium text-slate-900 dark:text-slate-300">
                    I want to teach on this platform
                  </span>
                </label>

                {/* Smooth collapse for Instructor fields */}
                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isLecturer ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Professional Title / Specialization
                    </label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#135bec] transition-colors">
                        workspace_premium
                      </span>
                      <input
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#135bec]/20 focus:border-[#135bec] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none"
                        placeholder="e.g. Senior Software Engineer at AI Corp"
                        type="text"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        required={isLecturer}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center h-5">
                  <input
                    className="size-4 text-[#135bec] focus:ring-[#135bec] border-slate-300 dark:border-slate-600 rounded cursor-pointer"
                    id="terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                </div>
                <label
                  className="text-xs text-slate-500 dark:text-slate-400 leading-tight cursor-pointer"
                  htmlFor="terms"
                >
                  By creating an account, you agree to our{" "}
                  <a
                    className="text-[#135bec] hover:underline font-medium"
                    href="#"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    className="text-[#135bec] hover:underline font-medium"
                    href="#"
                  >
                    Privacy Policy
                  </a>
                  .
                </label>
              </div>

              <button
                className="w-full py-4 px-6 rounded-xl bg-[#135bec] text-white font-bold text-lg hover:bg-[#135bec]/90 hover:shadow-lg hover:shadow-[#135bec]/20 transition-all flex items-center justify-center gap-2 group"
                type="submit"
              >
                Create Account
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </form>

            <div className="mt-8 text-center sm:hidden">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#135bec] font-bold hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
