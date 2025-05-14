export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  error?: string;
  label?: string;
  className?: string;
}
