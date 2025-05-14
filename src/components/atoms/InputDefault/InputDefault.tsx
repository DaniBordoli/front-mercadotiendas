import React from 'react';
import { colors } from '../../../design/colors';

interface InputDefaultProps {
  type?: 'text' | 'password' | 'email' | 'number' | 'date';
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode; 
}

export const InputDefault: React.FC<InputDefaultProps> = ({
  type = 'text',
  value,
  placeholder,
  onChange,
  className,
  disabled = false,
  icon,
}) => {
  return (
    <div className={`relative ${icon ? 'flex items-center' : ''}`}>
      {icon && (
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        style={{
          borderColor: colors.lightGray,
          color: colors.darkGray,
          borderRadius: '0.5rem',
        }}
        className={`border px-3 py-2 ${icon ? 'pl-10' : ''} font-space ${className || ''}`}
        disabled={disabled}
      />
    </div>
  );
};
