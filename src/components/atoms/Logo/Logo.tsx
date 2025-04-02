import React from 'react';
import { FaStore } from 'react-icons/fa';
import { LogoProps } from './types';

export const Logo: React.FC<LogoProps> = ({ 
  size = 28, 
  color = "skyblue",
  className = "" 
}) => {
  return (
    <FaStore size={size} color={color} className={className} />
  );
};
