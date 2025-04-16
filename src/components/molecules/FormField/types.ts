export type TextFieldType = 'text' | 'email' | 'password' | 'number';
export type SelectFieldType = 'select';
export type FieldType = TextFieldType | SelectFieldType;

export interface BaseFieldProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export interface TextFormFieldProps extends BaseFieldProps {
  type: TextFieldType;
  autoComplete?: string;
  suffix?: string;
  pattern?: string;
  patternMessage?: string;
  maxLength?: number;
  options?: never;
}

export interface SelectFormFieldProps extends BaseFieldProps {
  type: SelectFieldType;
  options: Array<{
    value: string;
    label: string;
  }>;
  autoComplete?: never;
  suffix?: never;
  pattern?: never;
  patternMessage?: never;
  maxLength?: never;
}

export type FormFieldProps = TextFormFieldProps | SelectFormFieldProps;
