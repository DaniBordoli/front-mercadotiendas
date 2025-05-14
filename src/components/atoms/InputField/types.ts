import { ReactNode } from 'react';

export interface InputFieldProps {
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'date';
  placeholder?: string | ReactNode;
  value?: string | number;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  error?: string;
  label?: string;
  autoComplete?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  suffix?: string;
  pattern?: string;
  patternMessage?: string;
  maxLength?: number;
}
