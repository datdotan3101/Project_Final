import React from "react";

const Toast = ({ message, type = "success" }) => {
  if (!message) return null;

  return (
    <div
      className={`fixed bottom-8 right-8 z-[9999] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300 border ${
        type === "success"
          ? "bg-[#1e293b] text-white border-green-500/30"
          : "bg-[#1e293b] text-white border-red-500/30"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          type === "success"
            ? "bg-green-600/20 text-green-400"
            : "bg-red-600/20 text-red-400"
        }`}
      >
        <span className="material-symbols-outlined text-[20px]">
          {type === "success" ? "check_circle" : "error"}
        </span>
      </div>
      <span className="font-bold text-sm tracking-wide">{message}</span>
    </div>
  );
};

export default Toast;
