import React from 'react';
import { InputFieldProps } from './types';

export const InputField: React.FC<InputFieldProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className,
  disabled = false,
  required = false,
  name,
  id,
  error,
  label,
  autoComplete
}) => {
  const baseStyles = "w-full h-10 sm:h-12 px-3 sm:px-4 py-2 border rounded-lg transition-all duration-200 focus:outline-none text-sm sm:text-base";
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
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={`
            ${baseStyles}
            ${stateStyles}
            ${disabledStyles}
            ${className || ''}
          `}
        />
        {error && (
          <p className="absolute -bottom-5 left-0 text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    </div>
  );
};
