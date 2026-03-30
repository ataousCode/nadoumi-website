import React from 'react';
import Input from '../../../../components/common/Input.jsx';
import FormSection from '../FormSection.jsx';

export default function SecurityStep({ formData, updateField, handleBlur, errors, touched, validateStep }) {
  const stepErrors = validateStep(4);

  const isFieldValid = (field) => {
    return touched[field] && !stepErrors[field];
  };

  return (
    <FormSection title="Account Security" icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}>
      <Input 
        label="Password" 
        type="password" 
        value={formData.password} 
        onChange={(e) => updateField('password', e.target.value)} 
        onBlur={() => handleBlur('password')}
        error={errors.password} 
        isValid={isFieldValid('password')}
        required 
      />
      <Input 
        label="Confirm Password" 
        type="password" 
        value={formData.confirmPassword} 
        onChange={(e) => updateField('confirmPassword', e.target.value)} 
        onBlur={() => handleBlur('confirmPassword')}
        error={errors.confirmPassword} 
        isValid={isFieldValid('confirmPassword')}
        required 
      />
      <div className="col-span-full pt-4">
         <label className={
           `flex items-start gap-4 cursor-pointer group p-4 rounded-2xl transition-all border
           ${formData.agreeTerms ? 'bg-green-50/10 border-green-200' : 'bg-gray-50/50 border-transparent hover:border-orange-500/10'}`
         }>
            <input 
              type="checkbox" 
              checked={formData.agreeTerms}
              onChange={(e) => {
                updateField('agreeTerms', e.target.checked);
                handleBlur('agreeTerms');
              }}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" 
            />
            <span className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-widest">
              I agree to the <button className="text-orange-500 font-black hover:underline">Terms</button> & <button className="text-orange-500 font-black hover:underline">Privacy</button>. All information provided is accurate.
            </span>
         </label>
         {errors.agreeTerms && <p className="mt-2 text-[10px] text-red-500 font-black px-4 uppercase tracking-widest leading-relaxed">Please accept the terms to proceed</p>}
      </div>
    </FormSection>
  );
}
