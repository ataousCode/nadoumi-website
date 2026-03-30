import React from 'react';
import Input from '../../../../components/common/Input.jsx';
import PhoneField from '../PhoneField.jsx';
import CountrySelect from '../CountrySelect.jsx';
import FormSection from '../FormSection.jsx';

export default function BasicInfoStep({ formData, updateField, handleBlur, errors, touched, validateStep }) {
  const stepErrors = validateStep(0);
  
  const isFieldValid = (field) => {
    return touched[field] && !stepErrors[field];
  };

  return (
    <FormSection title="Basic Student Info" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
      <Input 
        label="Surname" 
        placeholder="e.g. DUPONT" 
        value={formData.surname} 
        onChange={(e) => updateField('surname', e.target.value)} 
        onBlur={() => handleBlur('surname')}
        error={errors.surname} 
        isValid={isFieldValid('surname')}
        required 
      />
      <Input 
        label="Given Name" 
        placeholder="e.g. Jean" 
        value={formData.givenName} 
        onChange={(e) => updateField('givenName', e.target.value)} 
        onBlur={() => handleBlur('givenName')}
        error={errors.givenName} 
        isValid={isFieldValid('givenName')}
        required 
      />
      <Input 
        label="Email Address" 
        type="email" 
        value={formData.email} 
        onChange={(e) => updateField('email', e.target.value)} 
        onBlur={() => handleBlur('email')}
        error={errors.email} 
        isValid={isFieldValid('email')}
        required 
      />
      <PhoneField 
        label="Phone Number" 
        value={formData.phone} 
        onChange={(v) => updateField('phone', v)} 
        onBlur={() => handleBlur('phone')}
        error={errors.phone} 
        isValid={isFieldValid('phone')}
        required 
      />
      <CountrySelect 
        label="Country" 
        value={formData.country} 
        onChange={(v) => updateField('country', v)} 
        onBlur={() => handleBlur('country')}
        error={errors.country} 
        isValid={isFieldValid('country')}
        required 
      />
      <Input 
        label="Current City" 
        placeholder="Paris" 
        value={formData.city} 
        onChange={(e) => updateField('city', e.target.value)} 
        onBlur={() => handleBlur('city')}
        error={errors.city} 
        isValid={isFieldValid('city')}
        required 
      />
    </FormSection>
  );
}
