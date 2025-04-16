import React, { ReactNode } from 'react';
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
  autoComplete,
  onFocus,
  onBlur,
  suffix,
  pattern,
  patternMessage,
  maxLength
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
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={typeof placeholder === 'string' ? placeholder : undefined}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          pattern={pattern}
          maxLength={maxLength}
          className={`
            ${baseStyles}
            ${stateStyles}
            ${disabledStyles}
            ${suffix ? 'pr-24' : ''}
            ${className || ''}
          `}
        />
        {placeholder && typeof placeholder !== 'string' && (
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            {placeholder}
          </div>
        )}
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="text-gray-500">{suffix}</span>
          </div>
        )}
        {error && (
          <p className="absolute -bottom-5 left-0 text-xs text-red-500 mt-1">
            {patternMessage && error.includes('pattern') ? patternMessage : error}
          </p>
        )}
      </div>
    </div>
  );
};
