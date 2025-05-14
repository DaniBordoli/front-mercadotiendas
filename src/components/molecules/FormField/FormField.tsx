import React from 'react';
import { InputField } from '../../atoms/InputField';
import { SelectField } from '../../atoms/SelectField';
import { FormFieldProps, TextFormFieldProps, SelectFormFieldProps } from './types';

export const FormField: React.FC<FormFieldProps> = (props) => {
  const { type, label, name, required, error, className, disabled } = props;

  if (type === 'select') {
    const { options, value, onChange, placeholder } = props as SelectFormFieldProps & { value?: string; onChange?: (value: string) => void };
    return (
      <SelectField
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        name={name}
        id={name}
        label={label}
        required={required}
        error={error}
        className={className}
        disabled={disabled}
      />
    );
  }

  const { placeholder, value, onChange, autoComplete, suffix, pattern, patternMessage, maxLength } = props as TextFormFieldProps & { value?: string; onChange?: (value: string) => void };
  return (
    <InputField
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      id={name}
      label={label}
      required={required}
      error={error}
      className={className}
      autoComplete={autoComplete}
      disabled={disabled}
      suffix={suffix}
      pattern={pattern}
      patternMessage={patternMessage}
      maxLength={maxLength}
    />
  );
};
