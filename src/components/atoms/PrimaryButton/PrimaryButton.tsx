import React from 'react';
import { PrimaryButtonProps } from './types';
import { colors } from '../../../design/colors';

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  type = 'button',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  className = '',
  loading = false,
  icon: Icon,
  iconPosition = 'left',
}) => {
  const baseClass = 'primary-button';
  const sizeClass = size === 'small' ? 'primary-button--small' : size === 'large' ? 'primary-button--large' : '';
  const fullWidthClass = fullWidth ? 'primary-button--full-width' : '';
  const disabledClass = disabled ? 'primary-button--disabled' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClass} ${sizeClass} ${fullWidthClass} ${disabledClass} ${className} font-space`}
      style={{
        backgroundColor: colors.primaryRed,
        color: '#FFFFFF',
        width: fullWidth ? '100%' : 'auto', 
        height: '44px',
        borderRadius: '0.5rem',
        textAlign: 'center',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        opacity: disabled ? 0.5 : 1, 
      }}
      onMouseDown={(e) => (e.currentTarget.style.opacity = disabled ? '0.5' : '0.8')}
      onMouseUp={(e) => (e.currentTarget.style.opacity = disabled ? '0.5' : '1')}
      disabled={disabled || loading}
    >
      {Icon && iconPosition === 'left' && <Icon />}
      {loading ? 'Loading...' : children}
      {Icon && iconPosition === 'right' && <Icon />}
    </button>
  );
};
