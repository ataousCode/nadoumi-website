import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../utils/cn';
import logo from '../../../assets/icons/logo.jpg';

function AuthHeader({ className }) {
  const navigate = useNavigate();

  return (
    <header className={cn("w-full py-6 px-10 flex justify-between items-center bg-white", className)}>
      <div className="flex items-center gap-4 cursor-pointer group" onClick={() => navigate('/')}>
        <div className="relative">
          <img 
            src={logo} 
            alt="Nadoumi Logo" 
            className="h-10 w-10 rounded-xl shadow-lg shadow-orange-100 object-cover ring-4 ring-white transition-transform group-hover:scale-105" 
          />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black text-gray-900 tracking-tight leading-none group-hover:text-orange-600 transition-colors">Nadoumi</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">China University & Scholarship Portal</span>
        </div>
      </div>

      <button 
        onClick={() => navigate(-1)}
        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 border border-gray-100 shadow-sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
    </header>
  );
}

export default AuthHeader;
