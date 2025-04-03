import React, { useState } from 'react';
import { InputField, InputFieldProps } from '../InputField';

interface LabeledInputFieldProps extends InputFieldProps {
  label: string;
}

export const LabeledInputField: React.FC<LabeledInputFieldProps> = ({
  label,
  ...inputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full mb-2">
      <div className="relative">
        <span
          className={`absolute -top-2 left-4 bg-white px-2 text-sm z-10 transition-colors duration-200 ${
            isFocused ? 'text-sky-500' : 'text-gray-600'
          }`}
        >
          {label}
        </span>
        <InputField
          {...inputProps}
          className="mt-2 border-black focus:border-sky-500 focus:ring-sky-500"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
    </div>
  );
};
