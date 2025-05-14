export interface BaseFormField {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export interface TextFormField extends BaseFormField {
  type: 'text' | 'email' | 'password' | 'number' | 'date';
  autoComplete?: string;
  suffix?: string;
  pattern?: string;
  patternMessage?: string;
  maxLength?: number;
}

export interface SelectFormField extends BaseFormField {
  type: 'select';
  options: Array<{
    value: string;
    label: string;
  }>;
}

export type FormField = TextFormField | SelectFormField;

export interface FormProps {
  fields: FormField[];
  values: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void;
  onChange?: (name: string, value: string) => void;
  errors?: Record<string, string>;
  submitText?: string;
  className?: string;
  loading?: boolean;
}
