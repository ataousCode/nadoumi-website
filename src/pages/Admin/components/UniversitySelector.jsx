import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import Input from '../../../components/common/Input';

const UniversitySelector = ({ selectedIds = [], universities = [], onChange }) => {
  const handleRemove = (id) => {
    onChange(selectedIds.filter(uid => uid !== id));
  };

  const handleAdd = (id) => {
    if (id && !selectedIds.includes(id)) {
      onChange([...selectedIds, id]);
    }
  };

  const selectedUniversities = selectedIds.map(id => 
    universities.find(u => u.id === id)
  ).filter(Boolean);

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest ml-4 block border-l-2 border-orange-500/20 pl-2">
        Selected Host Universities
      </label>
      <div className="flex flex-wrap gap-2">
        {selectedUniversities.map(uni => (
          <div key={uni.id} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-xl text-xs font-bold shadow-sm transition-all hover:border-orange-200">
            <img src={uni.logo} alt="" className="w-4 h-4 rounded-full object-cover" />
            <span>{uni.name}</span>
            <button 
              type="button" 
              onClick={() => handleRemove(uni.id)}
              className="p-1 text-gray-300 hover:text-rose-500 transition-colors"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {selectedUniversities.length === 0 && (
          <p className="text-[10px] text-gray-400 italic ml-4">No universities selected yet.</p>
        )}
      </div>
      <Input 
        type="select" 
        value="" 
        onChange={e => handleAdd(e.target.value)} 
        options={[
          { value: '', label: 'Select a University to add...' }, 
          ...universities.map(u => ({ value: u.id, label: u.name }))
        ]} 
      />
    </div>
  );
};

export default UniversitySelector;
