import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate(); // Khởi tạo hook chuyển trang
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Submit login:", { email, password });

    // Chuyển hướng về trang chủ sau khi click
    navigate("/");
  };

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-slate-100 min-h-screen font-sans">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left Side - Banner */}
        <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white overflow-hidden bg-[#135bec]">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[#135bec]/60 mix-blend-multiply z-10"></div>
            {/* Đã thay bằng link ảnh Unsplash chất lượng cao */}
            <div
              className="h-full w-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop')",
              }}
            ></div>
          </div>
          <div className="relative z-20 flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg text-[#135bec] shadow-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-3xl font-bold">
                auto_stories
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">EduMarket AI</h2>
          </div>
          <div className="relative z-20 max-w-lg">
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Welcome back!
              <br />
              Ready to learn something new?
            </h1>
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              Access personalized learning paths powered by AI. Whether you're a
              student looking to grow or a lecturer sharing knowledge, your
              journey continues here.
            </p>
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-white">
                  psychology
                </span>
                <span className="text-sm font-medium">AI-Driven Insights</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 flex items-center gap-3">
                <span className="material-symbols-outlined text-white">
                  verified_user
                </span>
                <span className="text-sm font-medium">Expert-Led Courses</span>
              </div>
            </div>
          </div>
          <div className="relative z-20 text-sm opacity-80 italic">
            "Education is the most powerful weapon which you can use to change
            the world."
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 lg:px-24 bg-[#f6f6f8] dark:bg-[#101622]">
          <div className="w-full max-w-[440px]">
            <div className="mb-8 text-center lg:text-left">
              <div className="lg:hidden flex justify-center mb-6">
                <div className="bg-[#135bec] p-2 rounded-lg text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl font-bold">
                    auto_stories
                  </span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Sign In
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Welcome back to your personalized AI learning space.
              </p>
            </div>

            <div className="space-y-6">
              <button className="w-full flex items-center justify-center gap-4 py-4 px-6 bg-white border border-[#dadce0] rounded-xl shadow-[0_1px_2px_0_rgba(60,64,67,0.302),0_1px_3px_1px_rgba(60,64,67,0.149)] hover:bg-[#f8f9fa] transition-all duration-200 active:scale-[0.98] group">
                <div className="flex-shrink-0 flex items-center justify-center">
                  {/* Thay ảnh broken bằng SVG gốc của Google */}
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                </div>
                <span className="text-lg font-bold text-[#3c4043]">
                  Continue with Google
                </span>
              </button>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                <span className="flex-shrink mx-4 text-xs font-medium text-slate-400 uppercase tracking-widest">
                  or
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
              </div>

              <form className="space-y-5" onSubmit={handleLogin}>
                <div>
                  <label
                    className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                    htmlFor="email"
                  >
                    Email address
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#135bec]/20 focus:border-[#135bec] outline-none transition-all dark:text-white"
                    id="email"
                    placeholder="name@company.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label
                      className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <a
                      className="text-sm font-medium text-[#135bec] hover:text-[#135bec]/80 transition-colors"
                      href="#"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <input
                    className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-[#135bec]/20 focus:border-[#135bec] outline-none transition-all dark:text-white"
                    id="password"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  className="w-full bg-[#135bec] hover:bg-[#135bec]/90 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-[#135bec]/20 transition-all active:scale-[0.99]"
                  type="submit"
                >
                  Sign In
                </button>
              </form>

              <p className="text-center text-[13px] text-slate-400 dark:text-slate-500 px-4">
                By signing in, you agree to our{" "}
                <a className="underline" href="#">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a className="underline" href="#">
                  Privacy Policy
                </a>
                .
              </p>
            </div>

            <p className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?
              <Link
                className="font-bold text-[#135bec] hover:text-[#135bec]/80 transition-colors ml-1"
                to="/register"
              >
                Sign Up
              </Link>
            </p>

            <div className="mt-12 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#135bec]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#135bec]">
                  school
                </span>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Lecturer Access
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Are you a Lecturer? Sign in with your institutional Google
                  account to manage your AI-enhanced curriculum and dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
