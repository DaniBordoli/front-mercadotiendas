import React from 'react';
import logoTienda from '../../../public/assets/logoTienda.png'; // Import the logo
import { LogoProps } from './types';

export const Logo: React.FC<LogoProps> = ({ 
  size = 28, 
  className = "" 
}) => {
  return (
    <img 
      src={logoTienda} 
      alt="Logo Tienda" 
      style={{ width: size, height: size }} 
      className={className} 
    />
  );
};
