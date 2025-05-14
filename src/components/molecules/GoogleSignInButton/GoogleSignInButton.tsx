import React from 'react';
import { FcGoogle } from 'react-icons/fc';

interface GoogleSignInButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onClick, isLoading }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
    >
      <FcGoogle className="w-5 h-5 mr-2" />
      <span className="text-gray-700 font-medium">
        {isLoading ? 'Iniciando sesión...' : 'Inicia sesión con Google'}
      </span>
    </button>
  );
};
