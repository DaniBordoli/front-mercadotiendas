export interface NeutralButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  icon?: React.ComponentType;
  iconPosition?: 'left' | 'right';
}
