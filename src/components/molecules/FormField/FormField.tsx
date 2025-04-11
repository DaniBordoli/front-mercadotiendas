import React from 'react';
import { InputField } from '../../atoms/InputField';
import { SelectField } from '../../atoms/SelectField';
import { FormFieldProps } from './types';

export const FormField: React.FC<FormFieldProps> = (props) => {
  const { type, label, name, required, error, className, disabled } = props;

  if (type === 'select') {
    const { options, value, onChange, placeholder } = props;
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

  const { placeholder, value, onChange, autoComplete } = props;
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
    />
  );
};
