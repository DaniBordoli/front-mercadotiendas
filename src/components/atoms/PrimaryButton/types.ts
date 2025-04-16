import { ButtonProps as BaseButtonProps } from '../Button/types';
import { IconType } from 'react-icons';

export interface PrimaryButtonProps extends Omit<BaseButtonProps, 'variant'> {
 
  icon?: IconType; 
  iconPosition?: 'left' | 'right'; 
}
