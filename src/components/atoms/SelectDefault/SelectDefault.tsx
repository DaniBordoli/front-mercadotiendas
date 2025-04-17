import React from 'react';
import { colors } from '../../../design/colors';
import { FaChevronDown } from "react-icons/fa6";

interface SelectDefaultProps {
  options: { value: string; label: string }[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode; 
}

export const SelectDefault: React.FC<SelectDefaultProps> = ({
  options,
  value,
  placeholder,
  onChange,
  className,
  disabled = false,
  icon,
}) => {
  return (
    <div className="relative w-full">
      {icon && (
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        style={{
          borderColor: colors.lightGray,
          color: colors.darkGray,
          borderRadius: '0.5rem',
          backgroundColor: 'transparent',
          appearance: 'none',
        }}
        className={`border px-3 py-2 ${icon ? 'pl-10' : ''} ${className || ''}`}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <FaChevronDown className="text-gray-500" />
      </div>
    </div>
  );
};
