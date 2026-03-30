import React from 'react';
import Input from '../../../components/common/Input';

const LevelFinancialsEditor = ({ levels = [], data = {}, onChange }) => {
  const updateField = (level, field, value) => {
    onChange({
      ...data,
      [field]: {
        ...(data[field] || {}),
        [level]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      {levels.map(level => (
        <div key={level} className="p-8 bg-gray-50/50 rounded-[32px] border border-gray-100 transition-all focus-within:border-orange-200">
          <div className="flex items-center justify-between mb-6">
            <div className="text-[10px] font-black uppercase tracking-widest text-orange-600 border-b-2 border-orange-600/10 pb-1">
              {level} Program Details
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Input 
              label="Stipend (¥/mo)" 
              value={data.stipend?.[level] || ''} 
              onChange={e => updateField(level, 'stipend', e.target.value)} 
              placeholder="e.g. 2500"
            />
            <Input 
              label="Acc. (Original)" 
              value={data.accommodationFee?.[level] || ''} 
              onChange={e => updateField(level, 'accommodationFee', e.target.value)} 
              placeholder="e.g. 5000"
            />
            <Input 
              label="Acc. (Final)" 
              value={data.accommodationFeeAfterScholarship?.[level] || ''} 
              onChange={e => updateField(level, 'accommodationFeeAfterScholarship', e.target.value)} 
              className="text-emerald-600 font-bold"
              placeholder="e.g. 0"
            />
            <div className="flex gap-2">
              <Input 
                label="App Fee" 
                value={data.applicationFee?.[level] || ''} 
                onChange={e => updateField(level, 'applicationFee', e.target.value)} 
                placeholder="400"
              />
              <select 
                value={data.feeCurrency?.[level] || 'RMB'} 
                onChange={e => updateField(level, 'feeCurrency', e.target.value)} 
                className="mt-6 bg-white border border-gray-100 rounded-xl px-2 text-[10px] font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/10 transition-all shadow-sm"
              >
                <option>RMB</option>
                <option>USD</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LevelFinancialsEditor;
