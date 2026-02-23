import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BecomeLecturer = () => {
  const { user, login } = useAuth(); // Assuming login function updates the global user state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(null); // 'idle', 'pending', 'approved'
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    // Set initial status based on user data
    if (user.role === "LECTURER") {
      setStatus("approved");
    } else if (user.status === "PENDING_LECTURER") {
      setStatus("pending");
    } else {
      setStatus("idle");
    }
  }, [user, navigate]);

  const handleApply = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/users/become-lecturer",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setMessage(response.data.message);
      setStatus("pending");

      // Update local user state if possible (or just wait for refresh)
      // Since we don't have a direct "updateUser" in context, we just rely on local state here
      // and the user will see the pending status.
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Có lỗi xảy ra khi gửi yêu cầu.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b1120] min-h-screen text-slate-300 font-sans">
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        {/* Header Decor */}
        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 bg-blue-600/20 rounded-full border border-blue-500/30">
          <svg
            className="w-10 h-10 text-blue-400"
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
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
          Come teach with us
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
          Become an instructor and change lives — including your own. We provide
          the tools and platform to help you share your knowledge.
        </p>

        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl p-10 shadow-2xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full -mr-16 -mt-16"></div>

          {status === "idle" && (
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-4">
                Ready to start?
              </h2>
              <p className="text-slate-400 mb-8">
                By clicking the button below, your profile will be sent to our
                administration team for review. Once approved, you will gain
                access to the Instructor Dashboard to create your courses.
              </p>
              <button
                onClick={handleApply}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl transition duration-300 shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          )}

          {status === "pending" && (
            <div className="relative z-10 py-4">
              <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Application Pending
              </h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                Thank you for your interest! Your application is currently being
                reviewed by our team. We will notify you via email as soon as a
                decision is made.
              </p>
              <div className="bg-slate-800/50 px-4 py-2 rounded-lg inline-block text-yellow-400 text-sm font-semibold border border-yellow-400/20">
                Current Status: Under Review
              </div>
            </div>
          )}

          {status === "approved" && (
            <div className="relative z-10 py-4">
              <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-400 mb-2">
                You're already an Instructor!
              </h2>
              <p className="text-slate-400 mb-8">
                Welcome to the team! You can now start creating your own courses
                and sharing your knowledge.
              </p>
              <button
                onClick={() => navigate("/lecturer/dashboard")}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-xl transition duration-300 shadow-lg shadow-green-600/20"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {message && status === "idle" && (
            <p className="mt-4 text-red-400 font-medium">{message}</p>
          )}
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <div className="bg-slate-800/30 p-8 rounded-xl border border-slate-700/30">
            <div className="text-blue-400 text-3xl mb-4">🎓</div>
            <h3 className="text-white font-bold text-lg mb-2">
              Teach your way
            </h3>
            <p className="text-slate-400 text-sm">
              Publish the course you want, in the way you want, and always have
              control of your own content.
            </p>
          </div>
          <div className="bg-slate-800/30 p-8 rounded-xl border border-slate-700/30">
            <div className="text-blue-400 text-3xl mb-4">🌍</div>
            <h3 className="text-white font-bold text-lg mb-2">
              Inspire learners
            </h3>
            <p className="text-slate-400 text-sm">
              Teach what you know and help learners explore their interests,
              gain new skills, and advance their careers.
            </p>
          </div>
          <div className="bg-slate-800/30 p-8 rounded-xl border border-slate-700/30">
            <div className="text-blue-400 text-3xl mb-4">💰</div>
            <h3 className="text-white font-bold text-lg mb-2">Get rewarded</h3>
            <p className="text-slate-400 text-sm">
              Expand your professional network, build your expertise, and earn
              money on each paid enrollment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeLecturer;
