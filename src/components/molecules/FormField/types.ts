import { InputFieldProps } from '../../atoms/InputField/types';
import { SelectFieldProps } from '../../atoms/SelectField/types';

export type TextFieldType = 'text' | 'password' | 'email' | 'date';

interface BaseFormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export interface TextFormFieldProps extends BaseFormFieldProps {
  type: TextFieldType;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  autoComplete?: string;
}

export interface SelectFormFieldProps extends BaseFormFieldProps {
  type: 'select';
  options: SelectFieldProps['options'];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export type FormFieldProps = TextFormFieldProps | SelectFormFieldProps;
