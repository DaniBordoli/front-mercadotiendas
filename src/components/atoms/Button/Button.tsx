import React from 'react';
import { ButtonProps } from './types';

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  className = '',
  loading = false,
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm sm:text-base";
  
  const variantStyles = {
    primary: "bg-sky-500 text-white hover:bg-sky-600 focus:ring-sky-500",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500",
    outline: "border-2 border-sky-500 text-sky-500 hover:bg-sky-50 focus:ring-sky-500",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
  }[variant];

  const sizeStyles = {
    small: "px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm",
    medium: "px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base",
    large: "px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg"
  }[size];

  const widthStyles = fullWidth ? "w-full" : "";
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  const loadingStyles = loading ? "relative !text-transparent" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variantStyles}
        ${sizeStyles}
        ${widthStyles}
        ${disabledStyles}
        ${loadingStyles}
        ${className}
      `}
    >
      {children}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
    </button>
  );
};
