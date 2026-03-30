import React from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

const MajorsEditor = ({ majors = [], onChange }) => {
  const handleAddCategory = () => {
    onChange([...majors, { category: '', list: [] }]);
  };

  const handleRemoveCategory = (index) => {
    onChange(majors.filter((_, i) => i !== index));
  };

  const updateCategory = (index, value) => {
    const next = [...majors];
    next[index].category = value;
    onChange(next);
  };

  const handleAddMajor = (catIdx) => {
    const next = [...majors];
    next[catIdx].list = [...next[catIdx].list, ''];
    onChange(next);
  };

  const updateMajor = (catIdx, majorIdx, value) => {
    const next = [...majors];
    next[catIdx].list[majorIdx] = value;
    onChange(next);
  };

  const handleRemoveMajor = (catIdx, majorIdx) => {
    const next = [...majors];
    next[catIdx].list = next[catIdx].list.filter((_, i) => i !== majorIdx);
    onChange(next);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-4">
        <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">Programs by Category</label>
        <Button variant="secondary" size="sm" onClick={handleAddCategory}>
          <PlusIcon className="w-3 h-3 mr-1" />
          Add Category
        </Button>
      </div>

      <div className="space-y-6">
        {majors.map((cat, catIdx) => (
          <div key={catIdx} className="p-8 bg-gray-50/50 rounded-[40px] border border-gray-100 relative group transition-all hover:border-orange-200 shadow-sm focus-within:ring-4 focus-within:ring-orange-50">
            <button 
              type="button" 
              onClick={() => handleRemoveCategory(catIdx)}
              className="absolute top-6 right-6 p-2 text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all"
            >
              <TrashIcon className="w-5 h-5" />
            </button>

            <div className="mb-8 max-w-md">
              <Input 
                label="Category Name (e.g. Computer Science & IT)" 
                value={cat.category} 
                onChange={e => updateCategory(catIdx, e.target.value)} 
                className="bg-white border-orange-100"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-4">
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Available Majors</span>
                <button 
                  type="button" 
                  onClick={() => handleAddMajor(catIdx)}
                  className="text-[9px] font-black text-orange-600 uppercase tracking-widest hover:text-orange-800 transition-colors"
                >
                  + Add Major
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cat.list.map((major, majorIdx) => (
                  <div key={majorIdx} className="flex gap-2">
                    <Input 
                      value={major} 
                      onChange={e => updateMajor(catIdx, majorIdx, e.target.value)} 
                      className="bg-white py-2 text-xs"
                      placeholder="e.g. Software Engineering"
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveMajor(catIdx, majorIdx)}
                      className="p-2 text-gray-300 hover:text-rose-500 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {majors.length === 0 && (
          <div className="text-center py-12 bg-gray-50/30 rounded-[32px] border border-dashed border-gray-200 text-gray-400 text-sm italic">
            No program categories defined.
          </div>
        )}
      </div>
    </div>
  );
};

export default MajorsEditor;
