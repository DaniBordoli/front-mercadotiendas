import React from 'react';
import { SecondaryButtonProps } from './types';
import { colors } from '../../../design/colors';

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children, // Made optional
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
  const baseClass = 'secondary-button';
  const sizeClass = size === 'small' ? 'secondary-button--small' : size === 'large' ? 'secondary-button--large' : '';
  const fullWidthClass = fullWidth ? 'secondary-button--full-width' : '';
  const disabledClass = disabled ? 'secondary-button--disabled' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClass} ${sizeClass} ${fullWidthClass} ${disabledClass} ${className}`}
      style={{
        backgroundColor: `${colors.primaryRed}00`, 
        color: colors.primaryRed,
        border: `2px solid ${colors.primaryRed}`,
        width: 'auto',
        height: '44px',
        borderRadius: '0.5rem',
        textAlign: 'center',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
      }}
      onMouseDown={(e) => (e.currentTarget.style.backgroundColor = `${colors.primaryRed}0D`)}
      onMouseUp={(e) => (e.currentTarget.style.backgroundColor = `${colors.primaryRed}00`)} 
      disabled={disabled || loading}
    >
      {Icon && iconPosition === 'left' && <Icon />}
      {loading ? 'Loading...' : children && <span>{children}</span>}
      {Icon && iconPosition === 'right' && <Icon />}
    </button>
  );
};
