import React from "react";
import { cn } from "../../../utils/cn";

const Pagination = ({ current, total, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  return (
    <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
        Showing {Math.min(current * pageSize, total)} of {total} applications
      </p>
      <div className="flex items-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => onPageChange(n)}
            className={cn(
              "w-8 h-8 rounded-lg text-xs font-black transition-all",
              n === current
                ? "bg-blue-600 text-white"
                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
            )}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Pagination;
