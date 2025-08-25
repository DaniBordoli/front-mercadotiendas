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
    <div className={`relative ${icon ? 'flex items-center' : ''}`} style={{ width: '100%', maxWidth: '382px', height: '44px' }}>
      {icon && (
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
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
          height: '100%',
        }}
        className={`border px-3 py-2 ${icon ? 'pr-10' : ''} font-space ${className || ''} w-full`}
        disabled={disabled}
      />
    </div>
  );
};
