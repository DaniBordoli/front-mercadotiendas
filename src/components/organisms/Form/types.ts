import { TextFieldType, TextFormFieldProps, SelectFormFieldProps } from '../../molecules/FormField/types';

export type FormField = 
  | Omit<TextFormFieldProps, 'value' | 'onChange'> 
  | Omit<SelectFormFieldProps, 'value' | 'onChange'>;

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
