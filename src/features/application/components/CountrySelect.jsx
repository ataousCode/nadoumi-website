import React from 'react';
import Select from 'react-select';
import { getNames } from 'country-list';

const countryOptions = getNames().map(name => ({
  value: name,
  label: name
}));

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
    borderRadius: '0.75rem',
    border: '1px solid transparent',
    padding: '0.2rem 0.5rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(234, 88, 12, 0.1)' : 'none',
    '&:hover': {
      border: '1px solid rgba(234, 88, 12, 0.2)',
    }
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#ea580c' : state.isFocused ? '#fff7ed' : 'white',
    color: state.isSelected ? 'white' : '#374151',
    cursor: 'pointer',
    fontSize: '0.875rem',
  })
};

function CountrySelect({ label, value, onChange, required, error }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-bold text-gray-900 mb-1">
          {label}{required && ' *'}
        </label>
      )}
      <Select
        options={countryOptions}
        value={countryOptions.find(opt => opt.value === value)}
        onChange={(opt) => onChange(opt ? opt.value : '')}
        styles={customStyles}
        placeholder="Select country..."
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default CountrySelect;
