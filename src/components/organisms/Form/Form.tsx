import React from 'react';
import { Button } from '../../atoms/Button';
import { FormField } from '../../molecules/FormField';
import { FormProps } from './types';
import { FormFieldProps } from '../../molecules/FormField/types';

export const Form: React.FC<FormProps & { submitComponent?: React.ReactNode }> = ({
  fields,
  values,
  onSubmit,
  onChange,
  errors = {},
  submitText = 'Submit',
  className = '',
  loading = false,
  submitComponent
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const handleChange = (name: string, value: string) => {
    onChange?.(name, value);
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full space-y-4 sm:space-y-6 ${className}`}>
      <div className="space-y-3 sm:space-y-4">
        {fields.map((field) => {
        
          let fieldProps: FormFieldProps;
          
          if (field.type === 'select') {
            fieldProps = {
              ...field,
              value: values[field.name],
              onChange: (value: string) => handleChange(field.name, value),
              error: errors[field.name],
              options: field.options || [] 
            } as FormFieldProps;
          } else {
            fieldProps = {
              ...field,
              value: values[field.name],
              onChange: (value: string) => handleChange(field.name, value),
              error: errors[field.name]
            } as FormFieldProps;
          }

          return (
            <div key={field.name} className="w-full">
              <FormField {...fieldProps} />
            </div>
          );
        })}
      </div>
      {submitComponent ? (
        submitComponent
      ) : (
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
          loading={loading}
          size="large"
          className="mt-4 sm:mt-6"
        >
          {submitText}
        </Button>
      )}
    </form>
  );
};
