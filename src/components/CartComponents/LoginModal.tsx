import React, { useState } from 'react';
import { InputDefault } from '../atoms/InputDefault/InputDefault';
import { DesignButton } from '../atoms/DesignButton/DesignButton';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className="text-xl mb-6">Iniciar sesión</h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm mb-1">Email</label>
            <InputDefault
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Enter your email"
              className='w-full'
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm mb-1">Password</label>
            <InputDefault
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              className='w-full'
            />
          </div>
          <DesignButton
            type="submit"
            variant="primary"
            className="w-full h-11 font-space text-base"
          >
            Iniciar sesión
          </DesignButton>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
