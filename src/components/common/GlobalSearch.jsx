import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import Button from './Button.jsx';

function GlobalSearch({ 
  placeholder = "Search...", 
  onSearch, 
  showCategories = true,
  className 
}) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'language', label: 'Language' },
    { id: 'bachelor', label: 'Bachelor' },
    { id: 'master', label: 'Master' },
    { id: 'phd', label: 'PhD' },
  ];

  const handleSearch = (e) => {
    e?.preventDefault();
    onSearch?.({ query, category: activeCategory });
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      {showCategories && (
        <div className="flex justify-center gap-1.5 mb-5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                onSearch?.({ query, category: cat.id });
              }}
              className={cn(
                "px-5 py-2 text-[9px] font-black uppercase tracking-[0.15em] rounded-full transition-all duration-300",
                activeCategory === cat.id
                  ? "bg-gray-900 text-white shadow-soft"
                  : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      <form 
        onSubmit={handleSearch}
        className="bg-white border border-gray-100 p-1.5 rounded-[24px] shadow-soft flex flex-col md:flex-row gap-2"
      >
        <div className="flex-1 relative flex items-center">
          <div className="absolute left-5 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-12 pr-6 py-4 md:py-3.5 bg-transparent text-xs font-bold text-gray-900 placeholder:text-gray-300 focus:outline-none"
          />
        </div>
        
        <div className="h-10 w-px bg-gray-50 hidden md:block self-center" />

        <button 
          type="submit"
          className="md:w-auto w-full px-8 py-3.5 rounded-[18px] bg-orange-600 text-white font-black text-[9px] uppercase tracking-[0.2em] shadow-md shadow-orange-100 hover:bg-orange-700 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Search</span>
          <svg className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7-7 7" />
          </svg>
        </button>
      </form>
    </div>
  );
}

export default GlobalSearch;
