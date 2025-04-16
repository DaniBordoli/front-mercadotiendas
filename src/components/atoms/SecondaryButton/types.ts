import { IconType } from 'react-icons';

export interface SecondaryButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  icon?: IconType; 
  iconPosition?: 'left' | 'right'; 
}
