import React from 'react';
import Input from '../../../../components/common/Input.jsx';
import FormSection from '../FormSection.jsx';

const degreeLevels = [
  { label: 'High School', value: 'High School' },
  { label: 'Bachelor', value: 'Bachelor' },
  { label: 'Master', value: 'Master' },
  { label: 'PHD', value: 'PHD' },
  { label: 'Other', value: 'Other' },
];

export default function EducationStep({ formData, updateField, handleBlur, errors, touched, validateStep }) {
  const stepErrors = validateStep(2);

  const isFieldValid = (field) => {
    return touched[field] && !stepErrors[field];
  };

  return (
    <FormSection title="Education Background" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>}>
      <Input 
        label="Current Level" 
        type="select" 
        options={degreeLevels} 
        value={formData.currentLevel} 
        onChange={(e) => updateField('currentLevel', e.target.value)} 
        onBlur={() => handleBlur('currentLevel')}
        error={errors.currentLevel} 
        isValid={isFieldValid('currentLevel')}
        required 
      />
      <Input 
        label="University / School Name" 
        placeholder="Sorbonne University" 
        value={formData.university} 
        onChange={(e) => updateField('university', e.target.value)} 
        onBlur={() => handleBlur('university')}
        error={errors.university} 
        isValid={isFieldValid('university')}
        required 
      />
      <Input 
        label="Major / Field of Study" 
        placeholder="Computer Science" 
        value={formData.major} 
        onChange={(e) => updateField('major', e.target.value)} 
        onBlur={() => handleBlur('major')}
        error={errors.major} 
        isValid={isFieldValid('major')}
        required 
      />
      <div className="grid grid-cols-2 gap-4">
        <Input 
          label="GPA (Opt)" 
          placeholder="3.8/4.0" 
          value={formData.gpa} 
          onChange={(e) => updateField('gpa', e.target.value)} 
          onBlur={() => handleBlur('gpa')}
          error={errors.gpa} 
          isValid={isFieldValid('gpa')}
        />
        <Input 
          label="Grad Year" 
          type="number" 
          placeholder="2024" 
          value={formData.gradYear} 
          onChange={(e) => updateField('gradYear', e.target.value)} 
          onBlur={() => handleBlur('gradYear')}
          error={errors.gradYear} 
          isValid={isFieldValid('gradYear')}
          required 
        />
      </div>
    </FormSection>
  );
}
