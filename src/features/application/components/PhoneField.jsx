import React from 'react';
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { cn } from '../../../utils/cn';

function PhoneField({ label, value, onChange, required, error }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-gray-900 mb-1">
          {label}{required && ' *'}
        </label>
      )}
      <div className="phone-input-container">
        <PhoneInput
          international
          defaultCountry="CN"
          value={value}
          onChange={onChange}
          className={cn(
            "flex h-[56px] w-full rounded-xl border border-transparent bg-gray-50/50 px-4 transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-500/10 focus-within:border-orange-500/20",
            error && "border-red-300"
          )}
        />
      </div>
      <style>{`
        .phone-input-container .PhoneInputInput {
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.875rem;
          font-weight: 500;
          color: #111827;
          width: 100%;
          height: 100%;
        }
        .phone-input-container .PhoneInputCountry {
          margin-right: 0.75rem;
        }
      `}</style>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default PhoneField;
