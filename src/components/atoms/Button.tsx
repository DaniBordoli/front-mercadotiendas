import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

function Button({ children, onClick, className }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-11/12 h-14 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400 ${className || ''}`}
    >
      {children}
    </button>
  );
}

export default Button;
