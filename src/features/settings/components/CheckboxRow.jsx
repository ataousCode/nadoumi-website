import React from "react";

const CheckboxRow = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div className="relative flex items-center">
      <input
        type="checkbox"
        className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition-all"
        checked={checked}
        onChange={onChange}
      />
      <svg
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={4}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
      {label}
    </span>
  </label>
);

export default CheckboxRow;
