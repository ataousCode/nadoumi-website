import React from 'react';
import { 
  AcademicCapIcon, 
  BanknotesIcon, 
  HomeIcon, 
  TrashIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import Input from '../../../components/common/Input';
import FormSection from '../../../components/common/FormSection';
import DynamicListEditor from '../../../components/common/DynamicListEditor';
import { TagIcon, Squares2X2Icon } from '@heroicons/react/24/outline';

const ProgramConfigPanel = ({ program, onChange, onRemove }) => {
  const updateField = (field, value) => {
    onChange({ ...program, [field]: value });
  };

  const updateAccommodation = (idx, updates) => {
    const next = [...(program.accommodations || [])];
    next[idx] = { ...next[idx], ...updates };
    onChange({ ...program, accommodations: next });
  };

  return (
    <div className="relative group/panel bg-white rounded-[48px] border border-gray-100 shadow-2xl shadow-gray-200/40 p-1 overflow-hidden transition-all hover:border-gray-200">
      {/* Tab Header */}
      <div className="flex items-center justify-between px-10 py-6 bg-gray-50/50 rounded-t-[44px] border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-gray-900/20">
            <AcademicCapIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1">{program.category} level</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Independent Program Configuration</p>
          </div>
        </div>
        <button 
          type="button" 
          onClick={onRemove}
          className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
          title="Remove Level"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="p-10 space-y-12">
        {/* Basic Academics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          <div className="md:col-span-2 space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <TagIcon className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Majors / Specialties</span>
             </div>
             <div className="flex flex-wrap gap-2 p-4 bg-gray-50/50 rounded-3xl border border-gray-100 min-h-[100px]">
                <input 
                  type="text"
                  placeholder="Type major and press Enter..."
                  className="bg-transparent border-none focus:ring-0 text-sm w-full"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.target.value.trim();
                      if (val && !program.majors?.includes(val)) {
                        updateField('majors', [...(program.majors || []), val]);
                        e.target.value = '';
                      }
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {(program.majors || []).map(major => (
                    <span key={major} className="px-3 py-1.5 bg-gray-900 text-white text-[10px] font-bold rounded-xl flex items-center gap-2">
                      {major}
                      <button onClick={() => updateField('majors', program.majors.filter(m => m !== major))} className="hover:text-red-400">×</button>
                    </span>
                  ))}
                </div>
             </div>
          </div>

          <div className="md:col-span-2 space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <Squares2X2Icon className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Academic Fields</span>
             </div>
             <div className="flex flex-wrap gap-2 p-4 bg-gray-50/50 rounded-3xl border border-gray-100 min-h-[100px]">
                <input 
                  type="text"
                  placeholder="Type field and press Enter..."
                  className="bg-transparent border-none focus:ring-0 text-sm w-full"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = e.target.value.trim();
                      if (val && !program.fields?.includes(val)) {
                        updateField('fields', [...(program.fields || []), val]);
                        e.target.value = '';
                      }
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {(program.fields || []).map(f => (
                    <span key={f} className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-xl flex items-center gap-2">
                      {f}
                      <button onClick={() => updateField('fields', program.fields.filter(m => m !== f))} className="hover:text-blue-200">×</button>
                    </span>
                  ))}
                </div>
             </div>
          </div>
          
          <Input label="Duration (Years)" type="number" value={program.duration} onChange={e => updateField('duration', parseInt(e.target.value))} />
          <Input label="Intake" value={program.intake} onChange={e => updateField('intake', e.target.value)} placeholder="e.g. Autumn 2024" />
          <div className="md:col-span-2">
             <Input label="Legacy Program Name (Display)" value={program.programName} onChange={e => updateField('programName', e.target.value)} placeholder="e.g. Computer Science Program" />
          </div>
        </div>

        {/* Financial Details */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
            <BanknotesIcon className="w-5 h-5 text-gray-400" />
            <span className="text-xs font-black uppercase tracking-widest text-gray-900">Financial Coverage & Fees</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
             <div className="space-y-2">
                <Input type="checkbox" label="Offers Stipend" checked={program.stipendEnabled} onChange={e => updateField('stipendEnabled', e.target.checked)} />
                {program.stipendEnabled && (
                  <Input label="Amount (¥/mo)" type="number" value={program.stipendAmount} onChange={e => updateField('stipendAmount', parseFloat(e.target.value))} />
                )}
             </div>
             <Input label="Base Tuition" type="number" value={program.tuitionFee} onChange={e => updateField('tuitionFee', parseFloat(e.target.value))} />
             <Input label="Final Tuition" type="number" value={program.tuitionFeeAfter} onChange={e => updateField('tuitionFeeAfter', parseFloat(e.target.value))} className="text-orange-600 font-bold" />
             <div className="flex gap-2">
                <Input label="App Fee" type="number" value={program.applicationFee} onChange={e => updateField('applicationFee', parseFloat(e.target.value))} />
                <Input type="select" label="Currency" className="w-24 mt-6" value={program.currency} onChange={e => updateField('currency', e.target.value)} options={[{value:'RMB',label:'RMB'},{value:'USD',label:'USD'}]} />
             </div>
          </div>
        </div>

        {/* Accommodations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <HomeIcon className="w-5 h-5 text-gray-400" />
              <span className="text-xs font-black uppercase tracking-widest text-gray-900">Accommodation Options</span>
            </div>
            <button 
              type="button"
              onClick={() => updateField('accommodations', [...(program.accommodations || []), { roomType: 'Single Room', isFree: true, price: 0, currency: program.currency }])}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-900 hover:text-white transition-all"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              Add Room Type
            </button>
          </div>

          {(program.accommodations || []).length === 0 ? (
            <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-[32px]">
              <p className="text-sm text-gray-400 font-medium italic">No specific accommodation details set.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {program.accommodations.map((acc, accIdx) => (
                <div key={accIdx} className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-gray-50/50 rounded-3xl border border-gray-100 items-end group/acc">
                  <Input label="Room Category" value={acc.roomType} onChange={e => updateAccommodation(accIdx, { roomType: e.target.value })} placeholder="e.g. Double Room" />
                  <div className="flex flex-col gap-2">
                    <Input type="checkbox" label="Free of Charge" checked={acc.isFree} onChange={e => updateAccommodation(accIdx, { isFree: e.target.checked, price: e.target.checked ? 0 : acc.price })} />
                  </div>
                  {!acc.isFree && (
                    <div className="flex gap-2">
                       <Input label="Price" type="number" value={acc.price} onChange={e => updateAccommodation(accIdx, { price: parseFloat(e.target.value) })} />
                       <Input type="select" label="Currency" className="w-24 mt-6" value={acc.currency} onChange={e => updateAccommodation(accIdx, { currency: e.target.value })} options={[{value:'RMB',label:'RMB'},{value:'USD',label:'USD'}]} />
                    </div>
                  )}
                  <div className="md:col-span-1 flex justify-end">
                    <button 
                      type="button"
                      onClick={() => updateField('accommodations', program.accommodations.filter((_, i) => i !== accIdx))}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-white rounded-xl transition-all"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramConfigPanel;
