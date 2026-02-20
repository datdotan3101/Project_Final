import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({
  id = 1,
  title,
  image,
  category,
  duration,
  instructor,
  rating,
  reviewsCount,
  price,
  originalPrice,
  isBestseller = false,
}) => {
  return (
    <div className="group relative flex flex-col bg-[#1e293b] rounded-lg overflow-hidden border border-slate-800 hover:border-[#135bec]/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-800">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${image}')` }}
        ></div>

        {isBestseller && (
          <div className="absolute top-2 left-2 bg-[#f59e0b] text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
            Bestseller
          </div>
        )}

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
          <Link
            to={`/course/${id}`}
            className="bg-white text-slate-900 font-bold py-2 px-4 rounded-full shadow-lg hover:bg-[#135bec] hover:text-white transition-colors"
          >
            Quick View
          </Link>
        </div>
      </div>

      <div className="flex flex-col flex-grow p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#135bec] bg-[#135bec]/10 px-2 py-0.5 rounded">
            {category}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              schedule
            </span>{" "}
            {duration}
          </span>
        </div>

        <Link to={`/course/${id}`}>
          <h3 className="text-base font-bold text-white leading-tight mb-1 group-hover:text-[#135bec] transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        <p className="text-xs text-slate-400 mb-2">{instructor}</p>

        <div className="flex items-center gap-1 mb-3">
          <span className="text-yellow-400 text-sm font-bold">{rating}</span>
          <div className="flex text-yellow-400">
            <span className="material-symbols-outlined text-[14px] fill-current">
              star
            </span>
            <span className="material-symbols-outlined text-[14px] fill-current">
              star
            </span>
            <span className="material-symbols-outlined text-[14px] fill-current">
              star
            </span>
            <span className="material-symbols-outlined text-[14px] fill-current">
              star
            </span>
            <span className="material-symbols-outlined text-[14px] fill-current">
              star_half
            </span>
          </div>
          <span className="text-xs text-slate-500">({reviewsCount})</span>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-3 border-t border-slate-700/50">
          <span className="text-lg font-bold text-white">${price}</span>
          {originalPrice && (
            <span className="text-sm text-slate-500 line-through decoration-slate-500">
              ${originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
