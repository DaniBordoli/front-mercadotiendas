import React from 'react';
import { SelectFieldProps } from './types';
import { FaChevronDown } from 'react-icons/fa';

export const SelectField: React.FC<SelectFieldProps> = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  name,
  id,
  error,
  label,
  className
}) => {
  const baseStyles = "w-full h-10 sm:h-12 px-3 sm:px-4 py-2 border rounded-lg appearance-none transition-all duration-200 focus:outline-none pr-10 text-sm sm:text-base";
  const stateStyles = error
    ? "border-red-500 focus:ring-2 focus:ring-red-500 bg-red-50"
    : "border-gray-300 focus:ring-2 focus:ring-sky-500 focus:border-transparent hover:border-sky-500";
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "";

  return (
    <div className="w-full mb-3 sm:mb-4">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-xs sm:text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          required={required}
          className={`
            ${baseStyles}
            ${stateStyles}
            ${disabledStyles}
            ${className || ''}
          `}
        >
          {placeholder && (
            <option value="" disabled selected={!value}>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="py-1">
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
          <FaChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
        </div>
        {error && (
          <p className="absolute -bottom-5 left-0 text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};
