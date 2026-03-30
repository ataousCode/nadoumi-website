import React from 'react';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import FormSection from '../../../components/common/FormSection';
import LevelFinancialsEditor from './LevelFinancialsEditor';
import Input from '../../../components/common/Input';
import DynamicListEditor from '../../../components/common/DynamicListEditor';

const ProgramLevelFinancialsSection = ({ 
  programCategories = [], 
  formData, 
  setFormData,
  updateArrayField 
}) => {
  return (
    <FormSection title="Financial Coverage" description="Define tiered costs and stipends for each program level." icon={BanknotesIcon}>
      <div className="space-y-8">
        <LevelFinancialsEditor 
          levels={programCategories} 
          data={formData} 
          onChange={updates => setFormData(prev => ({ ...prev, ...updates }))} 
        />
        
        <div className="p-8 bg-orange-50/20 rounded-[40px] border border-orange-100/50 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input 
            label="Base Tuition (Yearly)" 
            value={formData.originalTuitionFee} 
            onChange={e => setFormData(prev => ({ ...prev, originalTuitionFee: e.target.value }))} 
            placeholder="e.g. 25000"
          />
          <Input 
            label="Tuition After Scholarship" 
            value={formData.tuitionFeeAfterScholarship} 
            onChange={e => setFormData(prev => ({ ...prev, tuitionFeeAfterScholarship: e.target.value }))} 
            className="text-orange-600 font-bold"
            placeholder="e.g. 0"
          />
          <Input 
            label="Registration Fee" 
            value={formData.registrationFee} 
            onChange={e => setFormData(prev => ({ ...prev, registrationFee: e.target.value }))} 
            placeholder="e.g. 400"
          />
        </div>

        <DynamicListEditor 
          title="Global Miscellaneous Fees" 
          items={formData.additionalFees} 
          onAdd={() => setFormData(p => ({ ...p, additionalFees: [...p.additionalFees, { name: '', amount: '', currency: 'RMB' }] }))}
          onRemove={idx => setFormData(p => ({ ...p, additionalFees: p.additionalFees.filter((_, i) => i !== idx) }))}
          renderItem={(fee, idx) => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:border-orange-100">
              <Input label="Fee Label" value={fee.name} onChange={e => updateArrayField('additionalFees', idx, { name: e.target.value })} />
              <Input label="Price" value={fee.amount} onChange={e => updateArrayField('additionalFees', idx, { amount: e.target.value })} />
              <Input type="select" label="Currency" value={fee.currency} onChange={e => updateArrayField('additionalFees', idx, { currency: e.target.value })} options={[{v:'RMB',l:'RMB'},{v:'USD',l:'USD'}]} />
            </div>
          )}
        />
      </div>
    </FormSection>
  );
};

export default ProgramLevelFinancialsSection;
