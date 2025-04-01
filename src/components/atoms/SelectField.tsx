import React from 'react';

interface SelectFieldProps {
  options: { value: string; label: string }[];
  className?: string;
}

function SelectField({ options, className }: SelectFieldProps) {
  return (
    <select
      className={`w-11/12 h-12 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent mb-4 bg-transparent ${className || ''}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default SelectField;
