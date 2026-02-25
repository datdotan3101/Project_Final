import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-[#0b1120] border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: EduMarket Business */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold mb-2">EduMarket Business</h3>
            <Link
              to={
                user?.role === "LECTURER" || user?.role === "ADMIN"
                  ? "/lecturer/dashboard"
                  : "/become-lecturer"
              }
              className="text-sm hover:underline"
            >
              Teach on EduMarket
            </Link>
            <Link to="#" className="text-sm hover:underline">
              Get the app
            </Link>
            <Link to="#" className="text-sm hover:underline">
              About us
            </Link>
            <Link to="#" className="text-sm hover:underline">
              Contact us
            </Link>
          </div>

          {/* Column 2: Careers */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold mb-2">Careers</h3>
            <Link to="#" className="text-sm hover:underline">
              Blog
            </Link>
            <Link to="#" className="text-sm hover:underline">
              Help and Support
            </Link>
            <Link to="#" className="text-sm hover:underline">
              Affiliate
            </Link>
            <Link to="#" className="text-sm hover:underline">
              Investors
            </Link>
          </div>

          {/* Column 3: Terms */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-bold mb-2">Terms</h3>
            <Link to="#" className="text-sm hover:underline">
              Privacy policy
            </Link>
            <Link to="#" className="text-sm hover:underline">
              Cookie settings
            </Link>
            <Link to="#" className="text-sm hover:underline">
              Sitemap
            </Link>
            <Link to="#" className="text-sm hover:underline">
              Accessibility statement
            </Link>
          </div>

          {/* Column 4: Language Selector */}
          <div className="flex justify-end items-start">
            <button className="flex items-center gap-2 border border-slate-700 px-6 py-2 rounded text-white hover:bg-slate-800 transition shadow-lg">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              <span className="font-semibold italic">English</span>
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-6 h-6 bg-blue-600 rounded-sm transform rotate-45 transition-transform group-hover:rotate-90"></div>
            <span className="text-white font-extrabold text-xl tracking-tighter">
              EduMarket
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            © 2024 EduMarket, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
