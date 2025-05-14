import React from 'react';
import { Logo } from '../../atoms/Logo';
import { ProgressBar } from '../../atoms/ProgressBar';

export const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex items-center mb-4">
        <Logo className="mr-2" />
        <h1 className="text-2xl font-bold text-sky-500">MercadoTiendas</h1>
      </div>
      <div className="w-full max-w-md">
        <ProgressBar />
      </div>
    </div>
  );
};
