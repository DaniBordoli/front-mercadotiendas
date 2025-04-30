import React from 'react';
import { DesignButtonProps } from './types';
import { colors } from '../../../design/colors';

export const DesignButton: React.FC<DesignButtonProps & {
  customBackgroundColor?: string;
  customTextColor?: string;
  customBorderColor?: string;
}> = ({
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
  variant = 'primary',
  customBackgroundColor,
  customTextColor,
  customBorderColor,
}) => {
  const baseClass = `design-button design-button--${variant}`;
  const sizeClass = `design-button--${size}`;
  const fullWidthClass = fullWidth ? 'design-button--full-width' : '';
  const disabledClass = disabled ? 'design-button--disabled' : '';

  // Get styles based on variant
  const getButtonStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primaryRed,
          color: '#FFFFFF',
          border: 'none',
          opacity: disabled ? 0.5 : 1,
          font: 'font-space'
        };
      case 'secondary':
        return {
          backgroundColor: `${colors.primaryRed}00`,
          color: colors.primaryRed,
          border: `2px solid ${colors.primaryRed}`,
          font: ''
        };
      case 'neutral':
        return {
          backgroundColor: 'rgba(255, 79, 65, 0)',
          color: colors.darkGray,
          border: `2px solid ${colors.lightGray}`,
          font: ''
        };
      default:
        return {
          backgroundColor: colors.primaryRed,
          color: '#FFFFFF',
          border: 'none',
          opacity: disabled ? 0.5 : 1,
          font: 'font-space'
        };
    }
  };

  const styles = getButtonStyles();

  // Handle mouse events based on variant
  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === 'primary') {
      e.currentTarget.style.opacity = disabled ? '0.5' : '0.8';
    } else if (variant === 'secondary') {
      e.currentTarget.style.backgroundColor = `${colors.primaryRed}0D`;
    } else if (variant === 'neutral') {
      e.currentTarget.style.backgroundColor = `${colors.mediumGray}0D`;
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (variant === 'primary') {
      e.currentTarget.style.opacity = disabled ? '0.5' : '1';
    } else if (variant === 'secondary') {
      e.currentTarget.style.backgroundColor = `${colors.primaryRed}00`;
    } else if (variant === 'neutral') {
      e.currentTarget.style.backgroundColor = `${colors.mediumGray}00`;
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClass} ${sizeClass} ${fullWidthClass} ${disabledClass} ${className} ${styles.font}`}
      style={{
        backgroundColor: customBackgroundColor || styles.backgroundColor,
        color: customTextColor || styles.color,
        border: customBorderColor ? `2px solid ${customBorderColor}` : styles.border,
        width: fullWidth ? '100%' : 'auto',
        height: '44px',
        borderRadius: '0.5rem',
        textAlign: 'center',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        opacity: variant === 'primary' ? styles.opacity : 1,
      }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      disabled={disabled || loading}
    >
      {Icon && iconPosition === 'left' && <Icon />}
      {loading ? 'Loading...' : children && <span>{children}</span>}
      {Icon && iconPosition === 'right' && <Icon />}
    </button>
  );
};
