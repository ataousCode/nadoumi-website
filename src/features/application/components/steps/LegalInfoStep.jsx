import React from 'react';
import Input from '../../../../components/common/Input.jsx';
import RadioGroup from '../RadioGroup.jsx';
import FormSection from '../FormSection.jsx';

export default function LegalInfoStep({ formData, updateField, handleBlur, errors, touched, validateStep }) {
  const stepErrors = validateStep(1);

  const isFieldValid = (field) => {
    return touched[field] && !stepErrors[field];
  };

  return (
    <FormSection title="Legal & Identification" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-4 0a2 2 0 012-2h2a2 2 0 012 2v1m-4 0h4" /></svg>}>
      <Input 
        label="Passport / National ID" 
        placeholder="A1234567" 
        value={formData.passport} 
        onChange={(e) => updateField('passport', e.target.value)} 
        onBlur={() => handleBlur('passport')}
        error={errors.passport} 
        isValid={isFieldValid('passport')}
        required 
      />
      <Input 
        label="Date of Birth" 
        type="date" 
        value={formData.dob} 
        onChange={(e) => updateField('dob', e.target.value)} 
        onBlur={() => handleBlur('dob')}
        error={errors.dob} 
        isValid={isFieldValid('dob')}
        required 
        className="[&::-webkit-calendar-picker-indicator]:bg-orange-500/10 [&::-webkit-calendar-picker-indicator]:p-1 [&::-webkit-calendar-picker-indicator]:rounded"
      />
      <RadioGroup 
        label="Gender" 
        options={[{label: 'Male', value: 'Male'}, {label: 'Female', value: 'Female'}, {label: 'Other', value: 'Other'}]}
        value={formData.gender}
        onChange={(v) => updateField('gender', v)}
      />
    </FormSection>
  );
}
