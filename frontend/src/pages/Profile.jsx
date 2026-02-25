import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    avatar_url: user?.avatar_url || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/api/users/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Cập nhật lại thông tin user trong context và localStorage
      login(response.data.user, token);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b1120] min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#1e293b] rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 border-b border-slate-700/50 bg-slate-800/30">
            <h2 className="text-2xl font-black text-white">Update Profile</h2>
            <p className="text-slate-400 text-sm mt-1">
              Manage your personal information and how it appears to others.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Status Message */}
            {message.text && (
              <div
                className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${
                  message.type === "success"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                <span className="material-symbols-outlined">
                  {message.type === "success" ? "check_circle" : "error"}
                </span>
                {message.text}
              </div>
            )}

            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-4 border-blue-600/30 p-1 overflow-hidden transition group-hover:border-blue-500">
                  <img
                    src={
                      formData.avatar_url ||
                      `https://ui-avatars.com/api/?name=${formData.name}`
                    }
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-slate-400 text-xs font-black uppercase tracking-widest mb-2">
                  Avatar URL
                </label>
                <input
                  type="text"
                  name="avatar_url"
                  value={formData.avatar_url}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-slate-400 text-xs font-black uppercase tracking-widest mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-xs font-black uppercase tracking-widest mb-2">
                  Email (Locked)
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 text-slate-500 text-sm cursor-not-allowed"
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-slate-400 text-xs font-black uppercase tracking-widest mb-2">
                Biography
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Tell us a bit about yourself..."
                className="w-full bg-slate-900 border border-slate-700/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined">save</span>
                    Update Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
