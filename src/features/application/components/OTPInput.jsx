import React, { useRef, useEffect } from 'react';

function OTPInput({ length = 6, value = '', onChange }) {
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (isNaN(val)) return;

    const newValue = value.split('');
    newValue[index] = val.slice(-1);
    const finalValue = newValue.join('');
    onChange(finalValue);

    if (val && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex justify-between gap-3">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-12 h-16 md:w-16 md:h-20 bg-gray-50/50 border border-transparent rounded-2xl text-center text-2xl font-black text-gray-900 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/20 transition-all outline-none shadow-sm"
        />
      ))}
    </div>
  );
}

export default OTPInput;
