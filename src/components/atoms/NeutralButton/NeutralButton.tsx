import React from 'react';
import { SecondaryButtonProps as NeutralButtonProps } from '../SecondaryButton/types';
import { colors } from '../../../design/colors';

export const NeutralButton: React.FC<NeutralButtonProps> = ({
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
  const baseClass = 'neutral-button';
  const sizeClass = size === 'small' ? 'neutral-button--small' : size === 'large' ? 'neutral-button--large' : '';
  const fullWidthClass = fullWidth ? 'neutral-button--full-width' : '';
  const disabledClass = disabled ? 'neutral-button--disabled' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClass} ${sizeClass} ${fullWidthClass} ${disabledClass} ${className}`}
      style={{
        backgroundColor: 'rgba(255, 79, 65, 0)',
        color: colors.darkGray,
        border: `2px solid ${colors.lightGray}`,
        width: fullWidth ? '100%' : 'auto',
        height: '44px',
        borderRadius: '0.5rem',
        textAlign: 'center',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
      }}
      onMouseDown={(e) => (e.currentTarget.style.backgroundColor = `${colors.mediumGray}0D`)}
      onMouseUp={(e) => (e.currentTarget.style.backgroundColor = `${colors.mediumGray}00`)}
      disabled={disabled || loading}
    >
      {Icon && iconPosition === 'left' && <Icon />}
      {loading ? 'Loading...' : children}
      {Icon && iconPosition === 'right' && <Icon />}
    </button>
  );
};
