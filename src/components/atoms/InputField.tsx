import React from 'react';

interface InputFieldProps {
  type: string;
  placeholder: string;
  className?: string;
}

function InputField({ type, placeholder, className }: InputFieldProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`w-11/12 h-12 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent mb-4 ${className || ''}`}
    />
  );
}

export default InputField;
