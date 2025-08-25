import React from 'react';
import { LogoProps } from './types';

export const Logo: React.FC<LogoProps> = ({ 
  size = 28,
  width,
  height, 
  className = "" 
}) => {
  const logoWidth = width || size;
  const logoHeight = height || size;
  
  return (
    <img 
      src="/logonuevo.png" 
      alt="MercadoTiendas Logo" 
      style={{ width: logoWidth, height: logoHeight }} 
      className={className} 
    />
  );
};
