import React from 'react';
import { CenteredBoxProps } from './types';

export const CenteredBox: React.FC<CenteredBoxProps> = ({
  children,
  width = '420px',
  height = 'auto',
  className = '',
  shadow = true,
  padding = true,
  rounded = true
}) => {
  const baseStyles = "flex flex-col transition-all duration-300";
  const shadowStyles = shadow ? "shadow-lg hover:shadow-xl" : "";
  const paddingStyles = padding ? "p-4 sm:p-6" : "";
  const roundedStyles = rounded ? "rounded-xl" : "";

  return (
    <div className="w-full px-4 py-6 sm:p-4 bg-gradient-to-br from-sky-50 to-white">
      <div
        style={{ width, minHeight: height }}
        className={`
          ${baseStyles}
          ${shadowStyles}
          ${paddingStyles}
          ${roundedStyles}
          ${className}
          bg-white
          max-w-full
          mx-auto
        `}
      >
        {children}
      </div>
    </div>
  );
};
