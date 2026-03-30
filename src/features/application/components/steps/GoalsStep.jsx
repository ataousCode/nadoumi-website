import React from 'react';
import Input from '../../../../components/common/Input.jsx';
import TagInput from '../TagInput.jsx';
import FormSection from '../FormSection.jsx';

const degreeLevels = [
  { label: 'Bachelor', value: 'Bachelor' },
  { label: 'Master', value: 'Master' },
  { label: 'PHD', value: 'PHD' },
  { label: 'Other', value: 'Other' },
];

export default function GoalsStep({ formData, updateField, handleBlur, errors, touched, validateStep }) {
  const stepErrors = validateStep(3);

  const isFieldValid = (field) => {
    return touched[field] && !stepErrors[field];
  };

  return (
    <FormSection title="Scholarship & Study Goals" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>}>
      <Input 
        label="Desired Study Level" 
        type="select" 
        options={degreeLevels} 
        value={formData.studyLevel} 
        onChange={(e) => updateField('studyLevel', e.target.value)} 
        onBlur={() => handleBlur('studyLevel')}
        error={errors.studyLevel} 
        isValid={isFieldValid('studyLevel')}
        required 
      />
      <Input 
        label="Desired Field" 
        placeholder="Artificial Intelligence" 
        value={formData.desiredField} 
        onChange={(e) => updateField('desiredField', e.target.value)} 
        onBlur={() => handleBlur('desiredField')}
        error={errors.desiredField} 
        isValid={isFieldValid('desiredField')}
        required 
      />
      <TagInput 
        label="Preferred Cities (Multiple)" 
        tags={formData.preferredCities} 
        onAdd={(tag) => {
          updateField('preferredCities', [...formData.preferredCities, tag]);
          handleBlur('preferredCities');
        }}
        onRemove={(id) => {
          updateField('preferredCities', formData.preferredCities.filter((_, i) => i !== id));
          handleBlur('preferredCities');
        }}
        placeholder="e.g. Shanghai"
        error={errors.preferredCities}
        isValid={isFieldValid('preferredCities')}
      />
    </FormSection>
  );
}
