import { IconType } from 'react-icons';
import { ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'neutral' | 'green';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface DesignButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  icon?: IconType;
  iconPosition?: 'left' | 'right';
  variant: ButtonVariant;
}
