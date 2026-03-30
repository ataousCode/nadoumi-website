import React from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import { cn } from '../../utils/cn';

const DynamicListEditor = ({ 
  items = [], 
  onAdd, 
  onRemove, 
  onUpdate, 
  renderItem, 
  title, 
  addLabel = "Add Item",
  emptyLabel = "No items added yet.",
  className = ""
}) => {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between px-4">
        {title && <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest block">{title}</label>}
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onAdd}
          className="text-[9px] font-bold"
        >
          <PlusIcon className="w-3 h-3 mr-1" />
          {addLabel}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item, index) => (
          <div key={index} className="relative group">
            {renderItem(item, index)}
            <button 
              type="button" 
              onClick={() => onRemove(index)}
              className="absolute -top-2 -right-2 w-7 h-7 bg-white border border-rose-100 text-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-50 shadow-sm z-10"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 bg-gray-50/30 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-xs italic">
            {emptyLabel}
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicListEditor;
