import React from 'react';
import { ProgressBar } from '../../atoms/ProgressBar';

export const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
     
      <div className="flex items-center justify-center w-full mb-8">
        <img src="/logoLogin/logoLogin.png" alt="Logo MercadoTiendas" className="w-60 h-auto" />
      </div>
     
      <div className="w-full max-w-md">
        <ProgressBar />
      </div>
    </div>
  );
};
