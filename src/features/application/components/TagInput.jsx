import React, { useState } from 'react';

function TagInput({ label, tags, onAdd, onRemove, placeholder }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      onAdd(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="space-y-3 col-span-full">
      {label && <label className="block text-sm font-bold text-gray-900">{label}</label>}
      <div className="flex flex-wrap gap-2 p-2 min-h-[56px] bg-gray-50/50 rounded-2xl border border-transparent focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-500/10 focus-within:border-orange-500/20 transition-all">
        {tags.map((tag, index) => (
          <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl text-xs font-bold text-gray-700 shadow-sm border border-gray-100">
            {tag}
            <button 
              onClick={() => onRemove(index)}
              className="text-gray-400 hover:text-rose-500 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium py-1.5 min-w-[120px]"
        />
      </div>
    </div>
  );
}

export default TagInput;
